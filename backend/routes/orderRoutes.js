import express from "express";
import Order from "../models/order.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import Activity from "../models/activity.js";

const router = express.Router();

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get("/myorders", isLoggedIn, async (req, res) => {
  try {
    console.log(`🔍 Fetching orders for user: ${req.user.email}`);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Test Email Configuration
// @route   GET /api/orders/test-email
// @access  Private/Admin
router.get("/test-email", isLoggedIn, async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");
    await sendEmail({
      email: req.user.email,
      subject: "Test Email from Reaina's Haven",
      html: "<h1>Email System is Working! ✅</h1><p>This is a test email to verify your SMTP configuration.</p>"
    });
    res.json({ message: "Test email sent successfully to " + req.user.email });
  } catch (error) {
    console.error("❌ Test Email Failed:", error.message);
    res.status(500).json({ message: "Email failed: " + error.message });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      console.log("✅ Order saved to Database:", createdOrder._id);

      // Log Activity
      await Activity.create({
        user: req.user._id,
        type: 'order',
        action: 'Placed an Order',
        details: `Order ID: ${createdOrder._id}`
      });
      
      // Send Order Confirmation Email (Premium Invoice Style) - Non-blocking
      console.log(`📨 Triggering professional invoice email for ${req.user.email}...`);
      const orderIdShort = createdOrder._id.toString().slice(-8).toUpperCase();
      
      try {
        await sendEmail({
          email: req.user.email,
          subject: `Order Confirmed! #${orderIdShort} - Reaina's Haven`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3a2d; max-width: 600px; margin: 0 auto; border: 1px solid #e0d8ce; padding: 40px; border-radius: 24px; background-color: #fff;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2d3a2d; margin: 0; font-family: serif; font-size: 28px;">Reaina's Haven</h1>
                <p style="font-size: 10px; color: #a67c52; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Botanical Sanctuary & Cafe</p>
              </div>
              
              <div style="background-color: #fcfaf8; padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #f0e8dc;">
                <h2 style="margin: 0; font-size: 20px; color: #2d3a2d;">Order Received! ✨</h2>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666;">We've received your order and we're getting it ready. If you chose an online payment, please complete it to start processing.</p>
              </div>

              <div style="margin-bottom: 30px;">
                <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Order ID: <b style="color: #2d3a2d;">#${orderIdShort}</b></p>
                <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Date: <b style="color: #2d3a2d;">${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</b></p>
                <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Payment Method: <b style="color: #2d3a2d;">${paymentMethod}</b></p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="border-bottom: 2px solid #f0e8dc;">
                    <th style="text-align: left; padding: 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8c8c73;">Item</th>
                    <th style="text-align: center; padding: 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8c8c73;">Qty</th>
                    <th style="text-align: right; padding: 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8c8c73;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${createdOrder.orderItems.map(item => `
                    <tr style="border-bottom: 1px solid #f8f5f2;">
                      <td style="padding: 15px 0; font-size: 14px; color: #2d3a2d; font-weight: 500;">${item.name}</td>
                      <td style="text-align: center; padding: 15px 0; font-size: 14px; color: #666;">${item.qty}</td>
                      <td style="text-align: right; padding: 15px 0; font-size: 14px; color: #2d3a2d;">₹${item.price.toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div style="text-align: right; background-color: #fcfaf8; padding: 20px; border-radius: 12px;">
                <p style="margin: 0; font-size: 13px; color: #8c8c73;">Subtotal: ₹${createdOrder.totalPrice.toLocaleString('en-IN')}</p>
                <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Shipping: <span style="color: #27ae60; font-weight: bold;">FREE</span></p>
                <h3 style="margin: 10px 0 0; color: #2d3a2d; font-size: 20px;">Total Amount: ₹${createdOrder.totalPrice.toLocaleString('en-IN')}</h3>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f0e8dc; text-align: center;">
                <p style="font-size: 14px; color: #2d3a2d; font-weight: 500; margin: 0;">Thank you for choosing Reaina's Haven!</p>
                <p style="font-size: 12px; color: #8c8c73; margin: 10px 0 0;">Visit your dashboard to track your order status.</p>
              </div>
            </div>
          `
        });
      } catch (err) {
        console.error("❌ User Order Email Error:", err.message);
      }

      // Send Order Notification Email to Admin
      try {
        await sendEmail({
          email: process.env.EMAIL_USER,
          subject: `🔔 New Order Received - #${orderIdShort}`,
          html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 15px;">
              <h2 style="color: #a67c52; border-bottom: 2px solid #a67c52; padding-bottom: 10px;">New Order Alert!</h2>
              <p>A new order has been placed on the website.</p>
              
              <div style="background: #fdfaf7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 5px 0;"><b>Order ID:</b> #${orderIdShort}</p>
                <p style="margin: 5px 0;"><b>Customer:</b> ${req.user.name} (${req.user.email})</p>
                <p style="margin: 5px 0;"><b>Total:</b> ₹${createdOrder.totalPrice.toLocaleString('en-IN')}</p>
                <p style="margin: 5px 0;"><b>Payment:</b> ${paymentMethod}</p>
              </div>

              <h3>Shipping Address:</h3>
              <p style="color: #666; line-height: 1.5;">
                ${shippingAddress.address}<br>
                ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                ${shippingAddress.country}
              </p>

              <div style="margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="background: #a67c52; color: #white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin Dashboard</a>
              </div>
            </div>
          `
        });
      } catch (err) {
        console.error("❌ Admin Order Email Error:", err.message);
      }

      // Emit socket event for new order
      if (req.io) {
        console.log(`🔌 Order Created! Emitting 'newOrder' to all clients for Order ID: ${createdOrder._id}`);
        req.io.emit("newOrder", createdOrder);
      } else {
        console.log("⚠️ Warning: req.io is not defined, socket notification skipped.");
      }
      
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
      // Check if the order belongs to the user or if user is admin
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(401).json({ message: "Not authorized to view this order" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Note: Direct payment update route removed for security. 
// Payments must be verified via /api/payment/verify in paymentRoutes.js

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", isLoggedIn, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      const oldStatus = order.status;
      order.status = status;
      
      // Generate OTP if moving to Out for Delivery or Delivered
      if (status === "Delivered" && !order.deliveryOTP) {
        order.deliveryOTP = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
      }

      if (status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      
      const updatedOrder = await order.save();
      
      // Fetch user email if not populated
      const populatedOrder = await Order.findById(order._id).populate("user", "name email");

      // Send Status Update Email with Full Invoice Details
      try {
        const orderIdShort = populatedOrder._id.toString().slice(-8).toUpperCase();
        let emailSubject = `Order Update: ${status} - #${orderIdShort}`;
        
        let emailHtml = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #a67c52; margin: 0;">Reaina's Haven</h1>
              <p style="font-size: 12px; color: #777;">Order Status Update</p>
            </div>
            <div style="background-color: #fdfaf7; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #e0d8ce;">
              <h2 style="margin: 0; color: #3e3e3e;">Your order is now ${status}!</h2>
              <p style="margin: 5px 0; font-size: 14px;">Order ID: <b>#${orderIdShort}</b></p>
            </div>
            
            ${status === "Delivered" ? `
              <div style="background: #fdfaf7; padding: 20px; border: 1px solid #e0d8ce; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #a67c52; margin-top: 0;">Delivery Verification OTP</h3>
                <p>Please use the OTP below to verify your delivery:</p>
                <h1 style="letter-spacing: 5px; color: #3e3e3e; text-align: center; margin: 10px 0;">${order.deliveryOTP}</h1>
              </div>
            ` : ""}

            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #fdfaf7;">
                  <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Item</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">Qty</th>
                  <th style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${populatedOrder.orderItems.map(item => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      <div style="font-weight: bold;">${item.name}</div>
                      ${item.ingredients && item.ingredients.length > 0 ? `
                        <div style="font-size: 10px; color: #8c8c73; margin-top: 4px;">
                          <b>Ingredients:</b> ${item.ingredients.join(', ')}
                        </div>
                      ` : ''}
                    </td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.qty}</td>
                    <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="background-color: #fcfaf8; padding: 15px; border-radius: 8px; font-size: 12px; color: #777; margin-bottom: 20px;">
              <p style="margin: 0;"><b>Health Note:</b> All our cafe goods are 100% handmade using natural ingredients and healthy alternatives where possible.</p>
            </div>
            <div style="text-align: right; line-height: 1.6;">
              <h3 style="margin: 10px 0; color: #a67c52;">Total Amount: ₹${populatedOrder.totalPrice}</h3>
            </div>
          </div>
        `;

        // Send to User
        await sendEmail({
          email: populatedOrder.user.email,
          subject: emailSubject,
          html: emailHtml
        });

        // Send a copy to Admin for records
        await sendEmail({
          email: process.env.EMAIL_USER,
          subject: `[ADMIN COPY] ${emailSubject}`,
          html: `<h3>Admin Copy of Status Update for ${populatedOrder.user.name}</h3>` + emailHtml
        });
      } catch (err) {
        console.error("Status Email Error:", err.message);
      }

      // Emit socket event for order status update
      if (req.io) {
        req.io.emit("orderUpdated", updatedOrder);
      }
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Verify Delivery OTP
// @route   POST /api/orders/:id/verify
// @access  Private
router.post("/:id/verify", isLoggedIn, async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.deliveryOTP === otp) {
        order.isOTPVerified = true;
        const updatedOrder = await order.save();
        
        if (req.io) {
          req.io.emit("deliveryVerified", updatedOrder);
          req.io.emit("orderUpdated", updatedOrder);
        }
        
        res.json({ message: "Delivery verified successfully!", order: updatedOrder });
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
