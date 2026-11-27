import express from "express";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";
import CafeItem from "../models/cafe.js";
import { isLoggedIn, isAdmin } from "../middlewares/authmiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import Activity from "../models/activity.js";

const router = express.Router();

// Helper to check admin role
const isUserAdmin = (user) => {
  if (!user) return false;
  const adminRoles = ["admin", "SUPER_ADMIN", "OPERATIONS_MANAGER"];
  return adminRoles.includes(user.role);
};

// @desc    Get logged in customer orders (both endpoints supported)
// @route   GET /api/orders/my-orders & GET /api/orders/myorders
// @access  Private
const getCustomerOrders = async (req, res) => {
  try {
    console.log(`🔍 Fetching orders for user: ${req.user.email}`);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get("/my-orders", isLoggedIn, getCustomerOrders);
router.get("/myorders", isLoggedIn, getCustomerOrders);

// @desc    Test Email Configuration
// @route   GET /api/orders/test-email
// @access  Private/Admin
router.get("/test-email", isLoggedIn, isAdmin, async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");
    await sendEmail({
      email: req.user.email,
      subject: "Test Email from Reaina's Haven",
      html: "<h1>Email System is Working! ✅</h1><p>This is a test email to verify your SMTP configuration.</p>",
    });
    res.json({ message: "Test email sent successfully to " + req.user.email });
  } catch (error) {
    console.error("❌ Test Email Failed:", error.message);
    res.status(500).json({ message: "Email failed: " + error.message });
  }
});

// @desc    Create new order with server-side validation and price verification
// @route   POST /api/orders
// @access  Private
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const {
      customer,
      deliveryAddress,
      shippingAddress: legacyShipping,
      location,
      items,
      orderItems: legacyOrderItems,
      paymentMethod = "Cash on Delivery",
    } = req.body;

    // 1. Resolve raw items
    const rawItems = (items && items.length > 0) ? items : legacyOrderItems;
    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty. Please add items before checking out." });
    }

    // 2. Validate Customer Details
    const customerName = (customer?.name || req.body.customerName || req.user.name || "").trim();
    const customerPhone = (customer?.phone || req.body.customerPhone || req.body.phone || "").trim();

    if (!customerName) {
      return res.status(400).json({ message: "Customer full name is required." });
    }

    // Mobile validation: 10 digits
    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!customerPhone || cleanPhone.length < 10) {
      return res.status(400).json({ message: "A valid 10-digit mobile number is required." });
    }

    // 3. Resolve Delivery Address
    const house = (deliveryAddress?.house || req.body.house || "").trim();
    const street = (deliveryAddress?.street || req.body.street || "").trim();
    const area = (deliveryAddress?.area || req.body.area || "").trim();
    const city = (deliveryAddress?.city || req.body.city || legacyShipping?.city || "").trim();
    const state = (deliveryAddress?.state || req.body.state || "").trim();
    const pincode = (deliveryAddress?.pincode || req.body.pincode || legacyShipping?.postalCode || "").trim();
    const landmark = (deliveryAddress?.landmark || req.body.landmark || "").trim();
    const instructions = (deliveryAddress?.instructions || req.body.instructions || "").trim();

    // If legacy format was passed with a single address string, try to satisfy or validate
    if (!house && legacyShipping?.address) {
      // Split or fallback
    }

    if (!house) {
      return res.status(400).json({ message: "House/Flat/Building number is required." });
    }
    if (!area) {
      return res.status(400).json({ message: "Area/Locality is required." });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required." });
    }
    if (!state) {
      return res.status(400).json({ message: "State is required." });
    }
    const cleanPincode = pincode.replace(/\D/g, "");
    if (!pincode || cleanPincode.length !== 6) {
      return res.status(400).json({ message: "A valid 6-digit Indian pincode is required." });
    }

    // 4. Secure Backend Price Calculation - Never trust frontend price/total
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of rawItems) {
      const quantity = Math.max(1, Number(item.quantity || item.qty || 1));
      let unitPrice = 0;
      let itemName = (item.name || "Artisanal Item").trim();
      let itemImage = item.image || item.imageUrl || item.imageurl || "";
      let itemIncludes = item.includes || "";
      let productId = item.product || item._id;

      let matchedInDb = false;

      // Check if product ID is valid MongoDB ObjectId
      if (productId && mongoose.Types.ObjectId.isValid(productId)) {
        // Try Product collection
        const dbProduct = await Product.findById(productId);
        if (dbProduct) {
          unitPrice = typeof dbProduct.price === "number" ? dbProduct.price : (dbProduct.price?.value || 0);
          itemName = dbProduct.name || itemName;
          itemImage = dbProduct.imageUrl || itemImage;
          itemIncludes = dbProduct.includes || itemIncludes;
          matchedInDb = true;
        } else {
          // Try Cafe collection
          const dbCafe = await CafeItem.findById(productId);
          if (dbCafe) {
            // Check if variant/quantityOption was selected
            if (item.selectedQty && item.selectedQty.price) {
              const matchedOpt = dbCafe.quantityOptions?.find(
                (opt) => opt.label === item.selectedQty.label
              );
              unitPrice = matchedOpt ? matchedOpt.price : Number(item.selectedQty.price);
            } else if (dbCafe.quantityOptions && dbCafe.quantityOptions.length > 0) {
              // Try finding matching price in options or use first
              const matchedOpt = dbCafe.quantityOptions.find(
                (opt) => opt.price === Number(item.price)
              );
              unitPrice = matchedOpt ? matchedOpt.price : dbCafe.quantityOptions[0].price;
            } else {
              unitPrice = Number(dbCafe.item_price || dbCafe.price || 0);
            }
            itemName = dbCafe.item_name || itemName;
            itemImage = dbCafe.imageurl || itemImage;
            itemIncludes = dbCafe.includes || itemIncludes;
            matchedInDb = true;
          }
        }
      }

      // If item wasn't found in DB (e.g. custom cart item or seed variation), fallback to sanitized positive item.price
      if (!matchedInDb) {
        const fallbackPrice = Number(item.price);
        unitPrice = (!isNaN(fallbackPrice) && fallbackPrice > 0) ? fallbackPrice : 0;
      }

      const itemSubtotal = unitPrice * quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        product: (productId && mongoose.Types.ObjectId.isValid(productId)) ? productId : undefined,
        name: itemName,
        quantity,
        price: unitPrice,
        subtotal: itemSubtotal,
        image: itemImage,
        includes: itemIncludes,
      });
    }

    const deliveryFee = 0.0; // Free delivery standard
    const totalAmount = calculatedSubtotal + deliveryFee;

    // 5. Geolocation Coordinates & Exact Location (optional)
    let coordinates = undefined;
    if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
      coordinates = {
        latitude: location.latitude,
        longitude: location.longitude,
        exactLocation: location.exactLocation || `${area}, ${city}`,
      };
    }

    // 6. Generate Human-Readable Order ID (e.g. RH1024)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `RH${randomSuffix}`;

    // Format full address for shippingAddress backward compatibility
    const fullStreetAddress = [house, street, area, landmark ? `Near ${landmark}` : ""]
      .filter(Boolean)
      .join(", ");

    const initialStatus = "PLACED";
    const initialPaymentStatus = paymentMethod === "Cash on Delivery" ? "COD" : "PENDING";

    const order = new Order({
      orderId,
      user: req.user._id,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: req.user.email,
      },
      deliveryAddress: {
        house,
        street,
        area,
        city,
        state,
        pincode,
        landmark,
        instructions,
      },
      location: coordinates,
      items: validatedItems,
      orderItems: validatedItems.map((i) => ({
        name: i.name,
        qty: i.quantity,
        image: i.image,
        price: i.price,
        product: i.product,
        includes: i.includes,
      })),
      shippingAddress: {
        address: fullStreetAddress,
        city,
        postalCode: pincode,
        country: "India",
      },
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalAmount,
      taxPrice: 0.0,
      shippingPrice: deliveryFee,
      totalPrice: totalAmount,
      orderStatus: initialStatus,
      status: initialStatus,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await order.save();
    console.log("✅ Order saved to Database:", createdOrder._id, "Order #", createdOrder.orderId);

    // Log Activity
    await Activity.create({
      user: req.user._id,
      type: "order",
      action: "Placed an Order",
      details: `Order #${createdOrder.orderId || createdOrder._id}`,
    });

    // Send Professional Order Confirmation Email
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmed! #${createdOrder.orderId} - Reaina's Haven`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3a2d; max-width: 600px; margin: 0 auto; border: 1px solid #e0d8ce; padding: 40px; border-radius: 24px; background-color: #fff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d3a2d; margin: 0; font-family: serif; font-size: 28px;">Reaina's Haven</h1>
              <p style="font-size: 10px; color: #a67c52; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Botanical Sanctuary & Cafe</p>
            </div>
            
            <div style="background-color: #fcfaf8; padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #f0e8dc;">
              <h2 style="margin: 0; font-size: 20px; color: #2d3a2d;">Order Placed Successfully! 🎉</h2>
              <p style="margin: 10px 0 0; font-size: 14px; color: #666;">Thank you for your order, ${customerName}. We have received your request and our artisans are preparing it with love.</p>
            </div>

            <div style="margin-bottom: 25px;">
              <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Order ID: <b style="color: #2d3a2d;">#${createdOrder.orderId}</b></p>
              <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Date: <b style="color: #2d3a2d;">${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</b></p>
              <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Payment Method: <b style="color: #2d3a2d;">${paymentMethod}</b> (${initialPaymentStatus})</p>
            </div>

            <div style="background: #faf8f5; padding: 18px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #efe8dd;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #a67c52; letter-spacing: 1px;">📍 Delivery Address</h4>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #3e3e3e;">
                ${house}, ${street ? street + ', ' : ''}${area}<br/>
                ${city}, ${state} - <b>${pincode}</b>
                ${landmark ? `<br/><span style="color: #777;">Landmark: Near ${landmark}</span>` : ''}
                ${instructions ? `<br/><span style="color: #777;">Instructions: ${instructions}</span>` : ''}
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="border-bottom: 2px solid #f0e8dc;">
                  <th style="text-align: left; padding: 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8c8c73;">Item</th>
                  <th style="text-align: center; padding: 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8c8c73;">Qty</th>
                  <th style="text-align: right; padding: 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8c8c73;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${validatedItems.map(item => `
                  <tr style="border-bottom: 1px solid #f8f5f2;">
                    <td style="padding: 12px 0; font-size: 14px; color: #2d3a2d; font-weight: 500;">${item.name}</td>
                    <td style="text-align: center; padding: 12px 0; font-size: 14px; color: #666;">${item.quantity}</td>
                    <td style="text-align: right; padding: 12px 0; font-size: 14px; color: #2d3a2d;">₹${item.subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="text-align: right; background-color: #fcfaf8; padding: 18px; border-radius: 12px;">
              <p style="margin: 0; font-size: 13px; color: #8c8c73;">Subtotal: ₹${calculatedSubtotal.toLocaleString('en-IN')}</p>
              <p style="margin: 5px 0; font-size: 13px; color: #8c8c73;">Delivery Fee: <span style="color: #27ae60; font-weight: bold;">FREE</span></p>
              <h3 style="margin: 10px 0 0; color: #2d3a2d; font-size: 20px;">Total Amount: ₹${totalAmount.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        `
      });
    } catch (err) {
      console.error("❌ Customer Order Confirmation Email Error:", err.message);
    }

    // Send Notification Email to Admin
    try {
      await sendEmail({
        email: process.env.EMAIL_USER,
        subject: `🔔 New Order Received - #${createdOrder.orderId}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 15px;">
            <h2 style="color: #a67c52; border-bottom: 2px solid #a67c52; padding-bottom: 10px;">New Order Alert!</h2>
            <p>A new order has been placed on Reaina's Haven.</p>
            <div style="background: #fdfaf7; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 5px 0;"><b>Order ID:</b> #${createdOrder.orderId}</p>
              <p style="margin: 5px 0;"><b>Customer:</b> ${customerName} (${customerPhone})</p>
              <p style="margin: 5px 0;"><b>Area:</b> ${area}, ${city}</p>
              <p style="margin: 5px 0;"><b>Total:</b> ₹${totalAmount.toLocaleString('en-IN')}</p>
              <p style="margin: 5px 0;"><b>Payment:</b> ${paymentMethod} (${initialPaymentStatus})</p>
              ${coordinates ? `<p style="margin: 5px 0;"><b>GPS Pinpoint:</b> ${coordinates.exactLocation || `${area}, ${city}`} (Exact Pinpoint Saved)</p>` : ''}
            </div>
          </div>
        `
      });
    } catch (err) {
      console.error("❌ Admin Notification Email Error:", err.message);
    }

    // Emit Socket.IO event for instant real-time admin update
    if (req.io) {
      console.log(`🔌 Order Created! Emitting 'newOrder' event for #${createdOrder.orderId}`);
      req.io.emit("newOrder", createdOrder);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Create Order Error:", error.message);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner or Admin)
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    let query = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { orderId: id };
    }

    const order = await Order.findOne(query).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check: Only order owner or Admin can view
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    const isAdminUser = isUserAdmin(req.user);

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "Access denied. You can only view your own orders." });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "Processing",
      "Shipped",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid order status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    order.status = status;

    // Delivery completion actions
    if (status === "DELIVERED" || status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      if (!order.deliveryOTP) {
        order.deliveryOTP = Math.floor(100000 + Math.random() * 900000).toString();
      }
      if (order.paymentMethod === "Cash on Delivery") {
        order.isPaid = true;
        order.paymentStatus = "PAID";
        order.paidAt = Date.now();
      }
    }

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(order._id).populate("user", "name email");

    // Send email notification for status update
    try {
      const orderIdDisplay = populatedOrder.orderId || populatedOrder._id.toString().slice(-8).toUpperCase();
      await sendEmail({
        email: populatedOrder.user?.email || populatedOrder.customer?.email,
        subject: `Order #${orderIdDisplay} Status Update: ${status} - Reaina's Haven`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 25px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #a67c52; margin: 0;">Reaina's Haven</h1>
              <p style="font-size: 12px; color: #777;">Order Status Update</p>
            </div>
            <div style="background-color: #fdfaf7; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center; border: 1px solid #e0d8ce;">
              <h2 style="margin: 0; color: #3e3e3e;">Your order is now <b>${status}</b>!</h2>
              <p style="margin: 8px 0 0; font-size: 14px;">Order ID: <b>#${orderIdDisplay}</b></p>
            </div>
            ${(status === "DELIVERED" || status === "Delivered") && order.deliveryOTP ? `
              <div style="background: #fdfaf7; padding: 20px; border: 1px solid #e0d8ce; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                <h3 style="color: #a67c52; margin-top: 0;">Delivery Verification OTP</h3>
                <h1 style="letter-spacing: 5px; color: #3e3e3e; margin: 10px 0;">${order.deliveryOTP}</h1>
              </div>
            ` : ""}
            <p style="color: #666; font-size: 14px;">Total Amount: ₹${(populatedOrder.totalAmount || populatedOrder.totalPrice)?.toLocaleString('en-IN')}</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Status Update Email Error:", err.message);
    }

    // Real-time broadcast to all connected clients
    if (req.io) {
      req.io.emit("orderUpdated", updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ PUT /api/orders/:id/status Error:", error);
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
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
