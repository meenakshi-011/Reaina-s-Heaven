import mongoose from "mongoose";
import { ROLES } from "../config/role.js";

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    price: { type: Number, default: 0 },
    description: { type: String, default: "" },
    previewColor: { type: String, default: "" },
    previewAsset: { type: String, default: "" },
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "select",
        "radio",
        "multiselect",
        "number",
        "text",
        "textarea",
        "color",
        "date",
        "product_picker",
      ],
      required: true,
      default: "select",
    },
    required: { type: Boolean, default: false },
    description: { type: String, default: "" },
    options: [optionSchema],
    defaultValue: { type: mongoose.Schema.Types.Mixed, default: null },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    unit: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    dependsOn: {
      fieldId: { type: String },
      value: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { _id: false }
);

const packagingOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const decorationOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const customizationConfigSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "Custom Design",
    },
    icon: {
      type: String,
      default: "Sparkles",
    },
    heroImage: {
      type: String,
      default: "",
    },
    assignedRole: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.OPERATIONS_MANAGER,
    },
    supportedModes: {
      type: [String],
      enum: ["INTERACTIVE", "AI_ASSISTED"],
      default: ["INTERACTIVE", "AI_ASSISTED"],
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    minNoticeHours: {
      type: Number,
      default: 24,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0.05, // 5% standard GST
      min: 0,
      max: 1,
    },
    fields: [fieldSchema],
    packagingOptions: [packagingOptionSchema],
    decorationOptions: [decorationOptionSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CustomizationConfig = mongoose.model("CustomizationConfig", customizationConfigSchema);

export default CustomizationConfig;

