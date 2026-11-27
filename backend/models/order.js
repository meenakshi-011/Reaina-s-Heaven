import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
    deliveryAddress: {
      house: { type: String, required: true },
      street: { type: String, default: "" },
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, default: "" },
      instructions: { type: String, default: "" },
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      exactLocation: { type: String, default: "" },
      accuracy: { type: Number },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        image: { type: String, default: "" },
        includes: { type: String, default: "" },
      },
    ],
    // Backwards compatibility with existing schemas and routes
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        ingredients: [String],
        includes: { type: String },
      },
    ],
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "COD"],
      default: "PENDING",
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },
    status: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
      ],
      default: "PLACED",
    },
    deliveryOTP: {
      type: String,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for auto-generating orderId and syncing compatibility fields
orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `RH${randomSuffix}`;
  }

  // Ensure totalAmount and totalPrice are synchronized
  if (this.totalAmount && !this.totalPrice) {
    this.totalPrice = this.totalAmount;
  } else if (this.totalPrice && !this.totalAmount) {
    this.totalAmount = this.totalPrice;
  }

  // Synchronize items and orderItems
  if (this.items && this.items.length > 0 && (!this.orderItems || this.orderItems.length === 0)) {
    this.orderItems = this.items.map((i) => ({
      name: i.name,
      qty: i.quantity,
      image: i.image || "",
      price: i.price,
      product: i.product,
      includes: i.includes,
    }));
  } else if (this.orderItems && this.orderItems.length > 0 && (!this.items || this.items.length === 0)) {
    this.items = this.orderItems.map((i) => ({
      product: i.product,
      name: i.name,
      quantity: i.qty,
      price: i.price,
      subtotal: i.price * i.qty,
      image: i.image || "",
      includes: i.includes,
    }));
  }

  // Synchronize deliveryAddress and shippingAddress
  if (this.deliveryAddress) {
    const da = this.deliveryAddress;
    const fullStreet = [da.house, da.street, da.area, da.landmark ? `Near ${da.landmark}` : ""]
      .filter(Boolean)
      .join(", ");
    if (!this.shippingAddress || !this.shippingAddress.address) {
      this.shippingAddress = {
        address: fullStreet,
        city: da.city,
        postalCode: da.pincode,
        country: "India",
      };
    }
  }

  // Synchronize orderStatus and status
  if (this.orderStatus && !this.status) {
    this.status = this.orderStatus;
  } else if (this.status && !this.orderStatus) {
    this.orderStatus = this.status;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
