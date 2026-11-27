import CustomizationConfig from "../models/customizationConfig.js";
import CustomizationRequest from "../models/customizationRequest.js";
import CustomizationQuote from "../models/customizationQuote.js";
import User from "../models/user.js";
import { calculateCustomizationPrice, getActiveConfigForCategory } from "../services/pricingService.js";
import { uploadReferenceImage } from "../services/cloudinaryService.js";
import { defaultConfigs } from "../services/defaultCustomizationConfigs.js";
import { analyzeCustomizationBrief } from "../services/aiCustomizationService.js";
import { ROLES } from "../config/role.js";

// Helper: check if user is admin or department staff
const getStaffPermissions = (user) => {
  if (!user) return { isStaff: false, allowedCategories: [] };

  const role = user.role;
  if (role === ROLES.SUPER_ADMIN || role === "admin" || role === ROLES.OPERATIONS_MANAGER) {
    return { isStaff: true, isSuperAdmin: true, allowedCategories: "ALL" };
  }

  const roleCategoryMap = {
    [ROLES.BAKER]: ["cakes"],
    [ROLES.CHEF]: ["food"],
    [ROLES.FLORIST]: ["flowers"],
    [ROLES.HAMPER_DESIGNER]: ["hampers", "personalized_gifts"],
  };

  const allowed = roleCategoryMap[role];
  if (allowed) {
    return { isStaff: true, isSuperAdmin: false, allowedCategories: allowed };
  }

  return { isStaff: false, allowedCategories: [] };
};

// ==========================================
// 1. CONFIGURATION CONTROLLERS
// ==========================================

export const getConfigs = async (req, res) => {
  try {
    let configs = await CustomizationConfig.find({ isActive: true }).sort({ displayOrder: 1 });

    // Seed defaults if empty
    if (!configs || configs.length === 0) {
      console.log("Seeding default customization configurations into database...");
      await CustomizationConfig.insertMany(defaultConfigs);
      configs = await CustomizationConfig.find({ isActive: true }).sort({ displayOrder: 1 });
    }

    res.json(configs);
  } catch (error) {
    // If DB fails, fallback cleanly to defaultConfigs array
    console.warn("DB config fetch failed, serving in-memory default configs:", error.message);
    res.json(defaultConfigs);
  }
};

export const getConfigByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const config = await getActiveConfigForCategory(category);
    if (!config) {
      return res.status(404).json({ message: `Customization category "${category}" not found.` });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdateConfig = async (req, res) => {
  try {
    const { category } = req.params;
    const updateData = req.body;

    const updated = await CustomizationConfig.findOneAndUpdate(
      { category: category.toLowerCase() },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: "Configuration updated successfully", config: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. PRICING ENGINE CONTROLLER
// ==========================================

export const calculatePrice = async (req, res) => {
  try {
    const {
      category,
      selectedOptions,
      selectedProducts,
      packagingOptionName,
      decorationOptionName,
      deliveryPincode,
    } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required for price calculation." });
    }

    const priceResult = await calculateCustomizationPrice({
      category,
      selectedOptions,
      selectedProducts,
      packagingOptionName,
      decorationOptionName,
      deliveryPincode,
    });

    res.json(priceResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// 3. REFERENCE IMAGE UPLOAD
// ==========================================

export const uploadReference = async (req, res) => {
  try {
    const { image, images, caption = "", requirementType = "general" } = req.body;

    if (Array.isArray(images) && images.length > 0) {
      const uploadResults = [];
      for (const img of images) {
        const result = await uploadReferenceImage({
          base64Data: img.base64Data || img.url || img,
          caption: img.caption || caption,
          requirementType: img.requirementType || requirementType,
        });
        uploadResults.push(result);
      }
      return res.json({ success: true, count: uploadResults.length, images: uploadResults });
    }

    if (!image) {
      return res.status(400).json({ message: "Image base64 data is required." });
    }

    const result = await uploadReferenceImage({
      base64Data: image,
      caption,
      requirementType,
    });

    res.json({ success: true, image: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// 4. REQUEST MANAGEMENT (CUSTOMER)
// ==========================================

export const createRequest = async (req, res) => {
  try {
    const {
      category,
      customizationMode = "INTERACTIVE",
      selectedOptions = {},
      selectedProducts = [],
      packagingOptionName,
      decorationOptionName,
      specifications = {},
      referenceImages = [],
      budget,
      occasion,
      deliveryDate,
      deliveryAddress = {},
      aiAnalysis,
    } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Customization category is required." });
    }

    // 1. Authoritative Backend Price Calculation
    const pricing = await calculateCustomizationPrice({
      category,
      selectedOptions,
      selectedProducts,
      packagingOptionName,
      decorationOptionName,
      deliveryPincode: deliveryAddress.pincode,
    });

    // 2. Resolve Customer details
    const customer = {
      name: (req.user?.name || req.body.customerName || "Customer").trim(),
      email: (req.user?.email || req.body.customerEmail || "").trim(),
      phone: (req.body.customerPhone || req.body.phone || "").trim(),
    };

    // 3. Find default department role from config
    const config = await getActiveConfigForCategory(category);
    const assignedRole = config?.assignedRole || ROLES.OPERATIONS_MANAGER;

    // 4. Create CustomizationRequest Document
    const newRequest = new CustomizationRequest({
      user: req.user._id,
      customer,
      category: category.toLowerCase(),
      customizationMode,
      selectedOptions,
      selectedProducts: pricing.verifiedProducts || [],
      packagingOption: {
        name: pricing.packaging.name,
        price: pricing.packaging.price,
      },
      decorationOption: {
        name: pricing.decoration.name,
        price: pricing.decoration.price,
      },
      specifications,
      referenceImages,
      budget: budget ? Number(budget) : null,
      occasion: occasion || "General Gifting",
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      deliveryAddress,
      estimatedPrice: pricing.estimatedPrice,
      priceBreakdown: pricing.breakdown,
      aiAnalysis: aiAnalysis || undefined,
      assignedRole,
      status: "PENDING",
    });

    await newRequest.save();

    // 5. Emit real-time Socket.IO notification to staff
    if (req.io) {
      req.io.emit("newCustomizationRequest", {
        _id: newRequest._id,
        requestNumber: newRequest.requestNumber,
        category: newRequest.category,
        customerName: newRequest.customer.name,
        estimatedPrice: newRequest.estimatedPrice,
        assignedRole: newRequest.assignedRole,
        createdAt: newRequest.createdAt,
      });
    }

    res.status(201).json({
      message: "Customization request submitted successfully! Our team will review your creation.",
      request: newRequest,
      pricing,
    });
  } catch (error) {
    console.error("Create customization request error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await CustomizationRequest.find({ user: req.user._id })
      .populate("activeQuote")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await CustomizationRequest.findById(id)
      .populate("user", "name email avatar")
      .populate("assignedTo", "name email role")
      .populate("activeQuote")
      .populate("orderId", "orderId totalAmount orderStatus paymentStatus isPaid");

    if (!request) {
      return res.status(404).json({ message: "Customization request not found." });
    }

    // Access control: Customer can view their own; staff/admin can view assigned
    const staff = getStaffPermissions(req.user);
    const isOwner = String(request.user?._id || request.user) === String(req.user._id);

    if (!isOwner && !staff.isStaff) {
      return res.status(403).json({ message: "Access denied to this customization request." });
    }

    // If staff has restricted category access
    if (staff.isStaff && !staff.isSuperAdmin && Array.isArray(staff.allowedCategories)) {
      if (!staff.allowedCategories.includes(request.category)) {
        return res.status(403).json({ message: `Access restricted to ${staff.allowedCategories.join(", ")} requests.` });
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await CustomizationRequest.findOne({ _id: id, user: req.user._id });

    if (!request) {
      return res.status(404).json({ message: "Customization request not found." });
    }

    const { specifications, deliveryAddress, occasion, deliveryDate, notes } = req.body;

    if (specifications) {
      request.specifications = { ...request.specifications, ...specifications };
    }
    if (deliveryAddress) {
      request.deliveryAddress = { ...request.deliveryAddress, ...deliveryAddress };
    }
    if (occasion) request.occasion = occasion;
    if (deliveryDate) request.deliveryDate = new Date(deliveryDate);

    if (notes) {
      request.revisionRequests.push({ note: notes, requestedAt: new Date() });
    }

    await request.save();

    if (req.io) {
      req.io.emit("customizationUpdated", { requestId: request._id, status: request.status });
    }

    res.json({ message: "Request updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 5. ADMIN & TEAM CONTROLLERS
// ==========================================

export const adminGetRequests = async (req, res) => {
  try {
    const staff = getStaffPermissions(req.user);
    if (!staff.isStaff) {
      return res.status(403).json({ message: "Access denied. Staff privileges required." });
    }

    const query = {};

    // Filter by department role if not Super Admin
    if (!staff.isSuperAdmin && Array.isArray(staff.allowedCategories)) {
      query.category = { $in: staff.allowedCategories };
    } else if (req.query.category && req.query.category !== "ALL") {
      query.category = req.query.category.toLowerCase();
    }

    if (req.query.status && req.query.status !== "ALL") {
      query.status = req.query.status;
    }

    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    const requests = await CustomizationRequest.find(query)
      .populate("user", "name email")
      .populate("assignedTo", "name email role")
      .populate("activeQuote")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdateStatus = async (req, res) => {
  try {
    const staff = getStaffPermissions(req.user);
    if (!staff.isStaff) {
      return res.status(403).json({ message: "Access denied. Staff privileges required." });
    }

    const { id } = req.params;
    const { status, note = "" } = req.body;

    const request = await CustomizationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    request.status = status;
    request.statusHistory.push({
      status,
      changedBy: req.user._id,
      note,
      timestamp: new Date(),
    });

    if (note) {
      request.internalNotes.push({
        note: `Status changed to ${status}: ${note}`,
        addedBy: req.user._id,
        createdAt: new Date(),
      });
    }

    await request.save();

    if (req.io) {
      req.io.emit("customizationStatusUpdated", {
        requestId: request._id,
        requestNumber: request.requestNumber,
        status,
        note,
        updatedAt: new Date(),
      });
    }

    res.json({ message: `Status updated to ${status}`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminAssignRequest = async (req, res) => {
  try {
    const staff = getStaffPermissions(req.user);
    if (!staff.isStaff) {
      return res.status(403).json({ message: "Staff privileges required." });
    }

    const { id } = req.params;
    const { staffUserId } = req.body;

    const assignedStaff = await User.findById(staffUserId);
    if (!assignedStaff) {
      return res.status(404).json({ message: "Staff user not found." });
    }

    const request = await CustomizationRequest.findByIdAndUpdate(
      id,
      {
        $set: {
          assignedTo: assignedStaff._id,
          assignedRole: assignedStaff.role,
        },
        $push: {
          internalNotes: {
            note: `Request assigned to ${assignedStaff.name} (${assignedStaff.role})`,
            addedBy: req.user._id,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("assignedTo", "name email role");

    res.json({ message: `Assigned to ${assignedStaff.name}`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 6. QUOTATION SYSTEM
// ==========================================

export const adminCreateQuote = async (req, res) => {
  try {
    const staff = getStaffPermissions(req.user);
    if (!staff.isStaff) {
      return res.status(403).json({ message: "Staff privileges required." });
    }

    const { id } = req.params;
    const { lineItems = [], subtotal, taxes = 0, deliveryCharge = 0, discount = 0, notes = "", validDays = 7 } = req.body;

    const request = await CustomizationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Customization request not found." });
    }

    // Determine quotation version count
    const existingQuotesCount = await CustomizationQuote.countDocuments({ requestId: request._id });
    const version = existingQuotesCount + 1;

    // Validate calculations
    const calcSubtotal = subtotal !== undefined ? Number(subtotal) : lineItems.reduce((acc, item) => acc + (item.total || 0), 0);
    const calcTotal = Math.max(0, Math.round(calcSubtotal + Number(taxes) + Number(deliveryCharge) - Number(discount)));

    const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);

    const quote = new CustomizationQuote({
      requestId: request._id,
      version,
      lineItems,
      subtotal: calcSubtotal,
      taxes: Number(taxes),
      deliveryCharge: Number(deliveryCharge),
      discount: Number(discount),
      total: calcTotal,
      notes,
      validUntil,
      status: "SENT",
      createdBy: req.user._id,
    });

    await quote.save();

    // Link active quote to request & update status
    request.activeQuote = quote._id;
    request.finalQuotedPrice = quote.total;
    request.status = "QUOTATION_SENT";
    request.statusHistory.push({
      status: "QUOTATION_SENT",
      changedBy: req.user._id,
      note: `Official Quotation v${version} sent for ₹${quote.total}`,
      timestamp: new Date(),
    });

    await request.save();

    if (req.io) {
      req.io.emit("newQuoteGenerated", {
        requestId: request._id,
        requestNumber: request.requestNumber,
        quoteId: quote._id,
        version: quote.version,
        total: quote.total,
      });
    }

    res.status(201).json({
      message: `Quotation v${version} sent successfully!`,
      quote,
      request,
    });
  } catch (error) {
    console.error("Create quote error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const customerRespondQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, revisionNote = "" } = req.body; // action: 'ACCEPT' | 'REJECT' | 'REVISE'

    const request = await CustomizationRequest.findOne({ _id: id, user: req.user._id }).populate("activeQuote");
    if (!request || !request.activeQuote) {
      return res.status(404).json({ message: "Customization request or active quotation not found." });
    }

    const quote = await CustomizationQuote.findById(request.activeQuote._id);
    if (!quote) {
      return res.status(404).json({ message: "Active quotation not found." });
    }

    if (action === "ACCEPT") {
      quote.status = "ACCEPTED";
      quote.acceptedAt = new Date();
      await quote.save();

      request.status = "APPROVED";
      request.statusHistory.push({
        status: "APPROVED",
        changedBy: req.user._id,
        note: `Quotation v${quote.version} accepted by customer. Ready for payment/order.`,
        timestamp: new Date(),
      });
      await request.save();

      if (req.io) {
        req.io.emit("customizationStatusUpdated", {
          requestId: request._id,
          status: "APPROVED",
          quoteId: quote._id,
        });
      }

      return res.json({
        message: "Quotation accepted! You can now proceed to finalize your order.",
        request,
        quote,
      });
    } else if (action === "REVISE" || action === "REJECT") {
      quote.status = action === "REVISE" ? "REVISED" : "REJECTED";
      quote.rejectedAt = new Date();
      quote.rejectionReason = revisionNote;
      await quote.save();

      const newStatus = action === "REVISE" ? "REVISION_REQUESTED" : "REJECTED";
      request.status = newStatus;
      request.revisionRequests.push({
        note: revisionNote || "Customer requested revision on quotation.",
        requestedAt: new Date(),
        resolved: false,
      });
      request.statusHistory.push({
        status: newStatus,
        changedBy: req.user._id,
        note: revisionNote,
        timestamp: new Date(),
      });
      await request.save();

      if (req.io) {
        req.io.emit("customizationStatusUpdated", {
          requestId: request._id,
          status: newStatus,
          revisionNote,
        });
      }

      return res.json({
        message: action === "REVISE" ? "Revision requested. Our team will review and update your quote." : "Quotation rejected.",
        request,
        quote,
      });
    } else {
      return res.status(400).json({ message: "Invalid action. Supported: ACCEPT, REVISE, REJECT." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 7. AI ASSISTED ANALYSIS
// ==========================================

export const aiAnalyze = async (req, res) => {
  try {
    const { prompt, budget, category, referenceImages = [], conversationHistory = [] } = req.body;

    if (!prompt && (!referenceImages || referenceImages.length === 0)) {
      return res.status(400).json({ message: "Please provide a prompt description or reference images." });
    }

    const analysis = await analyzeCustomizationBrief({
      prompt: prompt || "Visual design brief from uploaded references",
      budget,
      category,
      referenceImages,
      conversationHistory,
    });

    res.json(analysis);
  } catch (error) {
    console.error("AI Analysis error:", error);
    res.status(500).json({ message: error.message });
  }
};

