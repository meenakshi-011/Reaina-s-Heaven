import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import Activity from "../models/activity.js";

const router = express.Router();

// Lazy init — ensures dotenv has loaded before Razorpay is instantiated
let _razorpay = null;
const getRazorpay = () => {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
router.post("/order", isLoggedIn, async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await getRazorpay().orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Razorpay Order Creation Failed" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
router.post("/verify", isLoggedIn, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      db_order_id, // Our internal order ID
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const order = await Order.findById(db_order_id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: "Paid",
          update_time: Date.now().toString(),
          email_address: req.user.email,
        };
        await order.save();
        
        // Log Activity
        await Activity.create({
          user: req.user._id,
          type: 'order',
          action: 'Payment Successful',
          details: `Order ID: ${order._id}, Payment ID: ${razorpay_payment_id}`
        });

        // Send Payment Invoice Email
        try {
          const orderIdShort = order._id.toString().slice(-8).toUpperCase();
          await sendEmail({
            email: req.user.email,
            subject: `Payment Successful! Invoice for Order #${orderIdShort}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #a67c52; margin: 0;">Reaina's Haven</h1>
                  <p style="font-size: 12px; color: #777;">Green City, Jabalpur | Payment Receipt</p>
                </div>
                <div style="border-bottom: 2px solid #a67c52; padding-bottom: 10px; margin-bottom: 20px;">
                  <h2 style="margin: 0; font-size: 18px; color: #27ae60;">Payment Verified! ✅</h2>
                  <p style="margin: 5px 0; font-size: 14px;">Order ID: <b>#${orderIdShort}</b></p>
                  <p style="margin: 5px 0; font-size: 14px;">Payment ID: <b>${razorpay_payment_id}</b></p>
                  <p style="margin: 5px 0; font-size: 14px;">Status: <b>PAID</b></p>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #fdfaf7;">
                      <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Item</th>
                      <th style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">Qty</th>
                      <th style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.orderItems.map(item => `
                      <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                        <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.qty}</td>
                        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div style="text-align: right; line-height: 1.6;">
                  <h3 style="margin: 10px 0; color: #a67c52;">Total Paid: ₹${order.totalPrice}</h3>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
                  <p>Thank you for your payment!</p>
                  <p>Your order is now being processed for delivery.</p>
                </div>
              </div>
            `
          });
        } catch (err) {
          console.error("❌ Payment Email Error:", err.message);
        }
        
        // Notify via socket
        if (req.io) {
          req.io.emit("orderUpdated", order);
          req.io.emit("activityUpdate", { userId: req.user._id });
        }

        return res.json({ message: "Payment verified successfully", order });
      } else {
        return res.status(404).json({ message: "Internal Order not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
