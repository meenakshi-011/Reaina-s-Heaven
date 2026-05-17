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
    const { amount: frontendAmount, currency = "INR", receipt } = req.body;

    // Architecture Fix: Never trust frontend amount. 
    // Fetch price from DB to prevent payload tampering.
    const dbOrderId = receipt ? receipt.replace('receipt_', '') : null;
    let finalAmount = frontendAmount;
    
    if (dbOrderId) {
      const order = await Order.findById(dbOrderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found in DB" });
      }
      finalAmount = order.totalPrice;
    }

    const options = {
      amount: Math.round(finalAmount * 100), // amount in paise
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
  console.log("🔍 Verifying Payment payload:", req.body);
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
      // ✅ Step 1: Extra Security Check - Fetch payment details from Razorpay directly
      console.log("✅ Signature verified. Fetching payment details for:", razorpay_payment_id);
      const paymentDetails = await getRazorpay().payments.fetch(razorpay_payment_id);
      console.log("✅ Payment details fetched. Status:", paymentDetails.status);
      
      if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
        console.error("❌ Payment not captured/authorized. Status:", paymentDetails.status);
        return res.status(400).json({ message: "Payment was not successful on Razorpay" });
      }

      // ✅ Step 2: Amount Verification
      const order = await Order.findById(db_order_id);
      if (!order) {
        return res.status(404).json({ message: "Internal Order not found" });
      }

      // razorpay amount is in paise, so we divide by 100
      const paidAmount = paymentDetails.amount / 100;
      console.log(`💰 Verifying amounts: Paid ₹${paidAmount} vs Expected ₹${order.totalPrice}`);
      
      if (paidAmount < order.totalPrice) {
         console.error("❌ Paid amount mismatch! Expected:", order.totalPrice, "Got:", paidAmount);
         return res.status(400).json({ message: "Paid amount mismatch! Security alert triggered." });
      }

      // Architecture Fix: Idempotency Check
      // If webhook already processed this, or user clicked twice, prevent double execution
      if (order.isPaid) {
        console.log("⚠️ Order is already marked as paid. Returning early.");
        return res.json({ message: "Payment already verified successfully via webhook", order });
      }

      // Payment verified successfully
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: paymentDetails.status,
        update_time: Date.now().toString(),
        email_address: req.user.email,
        method: paymentDetails.method,
      };
      await order.save();
        
        // Log Activity
        await Activity.create({
          user: req.user._id,
          type: 'order',
          action: 'Payment Successful',
          details: `Order ID: ${order._id}, Payment ID: ${razorpay_payment_id}`
        });

        // ✅ Notify User: Payment Success Email
        try {
          const orderIdShort = order._id.toString().slice(-8).toUpperCase();
          await sendEmail({
            email: req.user.email,
            subject: `Payment Successful! Invoice for Order #${orderIdShort}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3a2d; max-width: 600px; margin: 0 auto; border: 1px solid #e0d8ce; padding: 40px; border-radius: 24px; background-color: #fff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2d3a2d; margin: 0; font-family: serif; font-size: 28px;">Reaina's Haven</h1>
                  <p style="font-size: 10px; color: #a67c52; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Payment Receipt</p>
                </div>
                
                <div style="background-color: #e8f5e9; padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #c8e6c9; text-align: center;">
                  <h2 style="margin: 0; font-size: 20px; color: #2e7d32;">Payment Verified! ✅</h2>
                  <p style="margin: 10px 0 0; font-size: 14px; color: #388e3c;">Your payment has been successfully processed.</p>
                </div>

                <div style="margin-bottom: 30px; display: grid; grid-template-cols: 1fr 1fr; gap: 20px;">
                  <div>
                    <p style="margin: 0; font-size: 11px; color: #8c8c73; text-transform: uppercase;">Order ID</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #2d3a2d; font-weight: bold;">#${orderIdShort}</p>
                  </div>
                  <div>
                    <p style="margin: 0; font-size: 11px; color: #8c8c73; text-transform: uppercase;">Payment ID</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #2d3a2d; font-weight: bold;">${razorpay_payment_id}</p>
                  </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #f0e8dc;">
                      <th style="text-align: left; padding: 12px 0; font-size: 12px; color: #8c8c73;">Item</th>
                      <th style="text-align: right; padding: 12px 0; font-size: 12px; color: #8c8c73;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.orderItems.map(item => `
                      <tr style="border-bottom: 1px solid #f8f5f2;">
                        <td style="padding: 15px 0; font-size: 14px; color: #2d3a2d;">${item.name} x ${item.qty}</td>
                        <td style="text-align: right; padding: 15px 0; font-size: 14px; color: #2d3a2d;">₹${item.price.toLocaleString('en-IN')}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <div style="text-align: right; background-color: #fcfaf8; padding: 20px; border-radius: 12px;">
                  <h3 style="margin: 0; color: #2d3a2d; font-size: 20px;">Total Paid: ₹${order.totalPrice.toLocaleString('en-IN')}</h3>
                </div>

                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f0e8dc; text-align: center; font-size: 12px; color: #8c8c73;">
                  <p>Thank you for your payment! Your botanical sanctuary goods are being prepared.</p>
                </div>
              </div>
            `
          });
        } catch (err) {
          console.error("❌ Payment Success Email Error:", err.message);
        }

        // ✅ Notify Admin: Payment Success
        try {
          const orderIdShort = order._id.toString().slice(-8).toUpperCase();
          await sendEmail({
            email: process.env.EMAIL_USER,
            subject: `💰 Payment Received! Order #${orderIdShort}`,
            html: `
              <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #27ae60;">Payment Confirmed</h2>
                <p>Payment has been successfully verified for <b>Order #${orderIdShort}</b>.</p>
                <div style="background: #f9f9f9; padding: 15px; margin: 15px 0;">
                  <p><b>Amount:</b> ₹${order.totalPrice.toLocaleString('en-IN')}</p>
                  <p><b>Customer:</b> ${req.user.name}</p>
                  <p><b>Razorpay ID:</b> ${razorpay_payment_id}</p>
                </div>
                <p>This order is now ready for fulfillment.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="display: inline-block; background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Admin Dashboard</a>
              </div>
            `
          });
        } catch (err) {
          console.error("❌ Admin Payment Notification Error:", err.message);
        }
        
        // Notify via socket
        if (req.io) {
          console.log("🔌 Emitting orderUpdated via socket to clients.");
          req.io.emit("orderUpdated", order);
          req.io.emit("activityUpdate", { userId: req.user._id });
        } else {
          console.warn("⚠️ req.io is undefined, cannot emit socket events!");
        }

        console.log("✅ Payment verification complete. Sending response.");
        return res.json({ message: "Payment verified successfully", order });
    } else {
      console.error("❌ Signature mismatch! Expected:", expectedSign, "Got:", razorpay_signature);
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("❌ Verification Route Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
