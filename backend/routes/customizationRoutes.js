import express from "express";
import {
  getConfigs,
  getConfigByCategory,
  adminUpdateConfig,
  calculatePrice,
  uploadReference,
  createRequest,
  getMyRequests,
  getRequestById,
  updateCustomerRequest,
  adminGetRequests,
  adminUpdateStatus,
  adminAssignRequest,
  adminCreateQuote,
  customerRespondQuote,
  aiAnalyze,
} from "../controllers/customizationController.js";
import { isLoggedIn, isAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Public / Configuration endpoints
router.get("/configs", getConfigs);
router.get("/configs/:category", getConfigByCategory);
router.put("/admin/configs/:category", isLoggedIn, isAdmin, adminUpdateConfig);

// Pricing Engine endpoint
router.post("/calculate-price", calculatePrice);

// AI Assistant endpoint
router.post("/ai/analyze", isLoggedIn, aiAnalyze);

// Reference Image upload
router.post("/upload-reference", isLoggedIn, uploadReference);

// Customer request endpoints
router.post("/requests", isLoggedIn, createRequest);
router.get("/requests/my", isLoggedIn, getMyRequests);
router.get("/requests/:id", isLoggedIn, getRequestById);
router.patch("/requests/:id", isLoggedIn, updateCustomerRequest);
router.post("/requests/:id/respond-quote", isLoggedIn, customerRespondQuote);

// Admin & Staff endpoints
router.get("/admin/requests", isLoggedIn, adminGetRequests);
router.patch("/admin/requests/:id/status", isLoggedIn, adminUpdateStatus);
router.post("/admin/requests/:id/assign", isLoggedIn, adminAssignRequest);
router.post("/admin/requests/:id/quote", isLoggedIn, adminCreateQuote);

export default router;
