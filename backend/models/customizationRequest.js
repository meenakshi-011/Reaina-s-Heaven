import mongoose from "mongoose";

export const CUSTOMIZATION_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "AI_SUGGESTIONS_READY",
  "QUOTATION_SENT",
  "REVISION_REQUESTED",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAID",
  "IN_PRODUCTION",
  "READY_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

const referenceImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    caption: { type: String, default: "" },
    requirementType: {
      type: String,
      default: "general", // e.g., 'cake_design', 'color_palette', 'decoration_inspiration', 'packaging'
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const selectedProductItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: CUSTOMIZATION_STATUSES,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    note: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const internalNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const revisionRequestSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
  },
  { _id: false }
);

const customizationRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, default: "", trim: true },
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    customizationMode: {
      type: String,
      enum: ["INTERACTIVE", "AI_ASSISTED"],
      default: "INTERACTIVE",
      required: true,
    },
    // Key-value map of selected dynamic options (e.g. flavour: "Belgian Chocolate", weight: 1.5, shape: "Heart")
    selectedOptions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Selected physical catalog products (e.g. for Hamper builder)
    selectedProducts: [selectedProductItemSchema],
    packagingOption: {
      name: { type: String, default: "Standard" },
      price: { type: Number, default: 0 },
    },
    decorationOption: {
      name: { type: String, default: "Standard" },
      price: { type: Number, default: 0 },
    },
    // Freeform and specialized specifications
    specifications: {
      messageOnProduct: { type: String, default: "" },
      dietaryRequirements: [{ type: String }],
      designDescription: { type: String, default: "" },
      recipientName: { type: String, default: "" },
      engravingText: { type: String, default: "" },
      specialInstructions: { type: String, default: "" },
    },
    referenceImages: [referenceImageSchema],
    budget: {
      type: Number,
      default: null,
      min: 0,
    },
    occasion: {
      type: String,
      default: "General Gifting",
    },
    deliveryDate: {
      type: Date,
    },
    deliveryAddress: {
      house: { type: String, default: "" },
      street: { type: String, default: "" },
      area: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      instructions: { type: String, default: "" },
    },
    // Authoritative pricing breakdown computed by backend
    estimatedPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    priceBreakdown: {
      basePrice: { type: Number, default: 0 },
      optionsTotal: { type: Number, default: 0 },
      selectedProductsTotal: { type: Number, default: 0 },
      packagingPrice: { type: Number, default: 0 },
      decorationPrice: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      estimatedTotal: { type: Number, default: 0 },
    },
    finalQuotedPrice: {
      type: Number,
      default: null,
    },
    activeQuote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomizationQuote",
      default: null,
    },
    aiAnalysis: {
      category: { type: String },
      occasion: { type: String },
      theme: { type: String },
      preferences: [{ type: String }],
      budget: { type: Number },
      suggestedProducts: [mongoose.Schema.Types.Mixed],
      missingDetails: [{ type: String }],
      designDescription: { type: String },
      specialInstructions: { type: String },
      rawAnalysis: { type: mongoose.Schema.Types.Mixed },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    assignedRole: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: CUSTOMIZATION_STATUSES,
      default: "PENDING",
      index: true,
    },
    statusHistory: [statusHistorySchema],
    revisionRequests: [revisionRequestSchema],
    internalNotes: [internalNoteSchema],
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

customizationRequestSchema.pre("save", async function () {
  if (!this.requestNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(2, 7).replace("-", "");
    this.requestNumber = `CR-${datePrefix}-${randomSuffix}`;
  }

  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
});

const CustomizationRequest = mongoose.model(
  "CustomizationRequest",
  customizationRequestSchema
);

export default CustomizationRequest;

