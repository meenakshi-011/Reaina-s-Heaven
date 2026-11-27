import mongoose from "mongoose";
import CustomizationConfig from "../models/customizationConfig.js";
import Product from "../models/product.js";
import CafeItem from "../models/cafe.js";
import { defaultConfigs } from "./defaultCustomizationConfigs.js";

/**
 * Helper to get active configuration for a category,
 * with fallback to defaultConfigs if DB has not yet been seeded or connected.
 */
export const getActiveConfigForCategory = async (category) => {
  const normalizedCategory = (category || "").toLowerCase().trim();
  let config = null;

  if (mongoose.connection.readyState === 1) {
    try {
      config = await CustomizationConfig.findOne({
        category: normalizedCategory,
        isActive: true,
      });
    } catch (err) {
      console.warn("Could not query DB for config, using default:", err.message);
    }
  }

  if (!config) {
    const fallback = defaultConfigs.find(
      (c) => c.category === normalizedCategory
    );
    if (fallback) {
      config = fallback;
    }
  }

  return config;
};

/**
 * Authoritative Backend Pricing Engine
 * Calculates exact line-by-line breakdown for any customization request.
 * NEVER trusts prices supplied by the client.
 */
export const calculateCustomizationPrice = async ({
  category,
  selectedOptions = {},
  selectedProducts = [],
  packagingOptionName = "",
  decorationOptionName = "",
  deliveryPincode = "",
}) => {
  const config = await getActiveConfigForCategory(category);

  if (!config) {
    throw new Error(`Invalid or unsupported customization category: "${category}"`);
  }

  const basePrice = Math.max(0, Number(config.basePrice) || 0);
  const taxRate = typeof config.taxRate === "number" ? config.taxRate : 0.05;
  const lineItems = [];
  const warnings = [];

  lineItems.push({
    description: `Base Crafting Fee (${config.displayName})`,
    category: "Base",
    unitPrice: basePrice,
    quantity: 1,
    total: basePrice,
  });

  let optionsTotal = 0;
  const fields = config.fields || [];

  // Convert selectedOptions to plain object if Map
  const optionsObj =
    selectedOptions instanceof Map
      ? Object.fromEntries(selectedOptions)
      : selectedOptions || {};

  // Evaluate each dynamic field configured for this category
  for (const field of fields) {
    const userVal = optionsObj[field.id];

    if (userVal === undefined || userVal === null) {
      if (field.required) {
        warnings.push(`Required field "${field.label}" was not selected.`);
      }
      continue;
    }

    if (field.type === "select" || field.type === "radio" || field.type === "color") {
      const matchedOpt = (field.options || []).find(
        (opt) => String(opt.value) === String(userVal)
      );

      if (matchedOpt) {
        const optPrice = Math.max(0, Number(matchedOpt.price) || 0);
        if (optPrice > 0) {
          optionsTotal += optPrice;
          lineItems.push({
            description: `${field.label}: ${matchedOpt.label}`,
            category: "Option",
            unitPrice: optPrice,
            quantity: 1,
            total: optPrice,
          });
        }
      }
    } else if (field.type === "multiselect") {
      const selectedArray = Array.isArray(userVal) ? userVal : [userVal];
      for (const val of selectedArray) {
        const matchedOpt = (field.options || []).find(
          (opt) => String(opt.value) === String(val)
        );
        if (matchedOpt) {
          const optPrice = Math.max(0, Number(matchedOpt.price) || 0);
          if (optPrice > 0) {
            optionsTotal += optPrice;
            lineItems.push({
              description: `${field.label}: ${matchedOpt.label}`,
              category: "Option",
              unitPrice: optPrice,
              quantity: 1,
              total: optPrice,
            });
          }
        }
      }
    } else if (field.type === "number") {
      const numVal = Number(userVal);
      if (isNaN(numVal) || numVal < 0) {
        warnings.push(`Invalid numeric value for "${field.label}".`);
      }
    }
  }

  // Evaluate selected real catalogue products (e.g. Gift Hamper items)
  let selectedProductsTotal = 0;
  const verifiedProducts = [];

  if (Array.isArray(selectedProducts) && selectedProducts.length > 0) {
    for (const item of selectedProducts) {
      const productId = item.product || item._id || item.id;
      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (!productId) continue;

      let dbProduct = null;
      try {
        dbProduct = await Product.findById(productId);
      } catch (err) {
        // Continue and check cafe item if needed
      }

      if (!dbProduct) {
        try {
          dbProduct = await CafeItem.findById(productId);
        } catch (err) {
          // Continue
        }
      }

      if (dbProduct) {
        const realPrice = Math.max(0, Number(dbProduct.price || dbProduct.item_price) || 0);
        const itemTotal = realPrice * requestedQty;
        selectedProductsTotal += itemTotal;

        const productName = dbProduct.name || dbProduct.item_name || "Catalogue Item";
        verifiedProducts.push({
          product: dbProduct._id,
          name: productName,
          price: realPrice,
          quantity: requestedQty,
          image: dbProduct.imageUrl || dbProduct.imageurl || "",
        });

        lineItems.push({
          description: `Hamper Item: ${productName} (x${requestedQty})`,
          category: "Product",
          unitPrice: realPrice,
          quantity: requestedQty,
          total: itemTotal,
        });
      } else {
        warnings.push(`One of the selected products (ID: ${productId}) is no longer available.`);
      }
    }
  }

  // Packaging selection
  let packagingPrice = 0;
  let resolvedPackagingName = packagingOptionName || "Standard";
  if (packagingOptionName && config.packagingOptions && config.packagingOptions.length > 0) {
    const matchedPackaging = config.packagingOptions.find(
      (p) => p.name.toLowerCase() === packagingOptionName.toLowerCase()
    );
    if (matchedPackaging) {
      packagingPrice = Math.max(0, Number(matchedPackaging.price) || 0);
      resolvedPackagingName = matchedPackaging.name;
      if (packagingPrice > 0) {
        lineItems.push({
          description: `Packaging: ${matchedPackaging.name}`,
          category: "Packaging",
          unitPrice: packagingPrice,
          quantity: 1,
          total: packagingPrice,
        });
      }
    }
  }

  // Decoration selection
  let decorationPrice = 0;
  let resolvedDecorationName = decorationOptionName || "";
  if (decorationOptionName && config.decorationOptions && config.decorationOptions.length > 0) {
    const matchedDeco = config.decorationOptions.find(
      (d) => d.name.toLowerCase() === decorationOptionName.toLowerCase()
    );
    if (matchedDeco) {
      decorationPrice = Math.max(0, Number(matchedDeco.price) || 0);
      resolvedDecorationName = matchedDeco.name;
      if (decorationPrice > 0) {
        lineItems.push({
          description: `Decoration: ${matchedDeco.name}`,
          category: "Decoration",
          unitPrice: decorationPrice,
          quantity: 1,
          total: decorationPrice,
        });
      }
    }
  }

  // Subtotal calculation
  const subtotal = Math.round(
    basePrice +
    optionsTotal +
    selectedProductsTotal +
    packagingPrice +
    decorationPrice
  );

  // Applicable Taxes
  const taxAmount = Math.round(subtotal * taxRate);

  // Delivery fee estimation: Free above ₹1200, otherwise ₹60
  const deliveryFee = subtotal >= 1200 || subtotal === 0 ? 0 : 60;

  // Final authoritative estimated total
  const estimatedTotal = subtotal + taxAmount + deliveryFee;

  return {
    category: config.category,
    displayName: config.displayName,
    lineItems,
    verifiedProducts,
    packaging: {
      name: resolvedPackagingName,
      price: packagingPrice,
    },
    decoration: {
      name: resolvedDecorationName,
      price: decorationPrice,
    },
    breakdown: {
      basePrice,
      optionsTotal,
      selectedProductsTotal,
      packagingPrice,
      decorationPrice,
      subtotal,
      taxAmount,
      taxRate: Math.round(taxRate * 100),
      deliveryFee,
      estimatedTotal,
    },
    estimatedPrice: estimatedTotal,
    isEstimate: true,
    warnings,
  };
};

export default {
  calculateCustomizationPrice,
  getActiveConfigForCategory,
};
