import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// ✅ dotenv MUST load FIRST before any route imports that use process.env
dotenv.config();

import connectDB from "./db.js";
import authroute from "./routes/authroutes.js";
import userroutes from "./routes/userroutes.js";
import productroutes from "./routes/productroutes.js";
import contentroutes from "./routes/contentroutes.js";
import caferoutes from "./routes/caferoute.js";
import bookroutes from "./routes/bookroutes.js";
import orderroutes from "./routes/orderRoutes.js";
import statsroutes from "./routes/statsRoutes.js";
import paymentroutes from "./routes/paymentRoutes.js";
import contactroutes from "./routes/contactRoutes.js";
import webhookroutes from "./routes/webhookRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected via Socket.io:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(cors());

// Webhook route needs raw body for signature verification
app.use("/api/webhook", express.raw({ type: 'application/json' }), webhookroutes);

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authroute);
app.use("/api/user", userroutes);
app.use("/api/products", productroutes);
app.use("/api", contentroutes);
app.use("/api/cafemenu", caferoutes);
app.use("/api/cafe", caferoutes);
app.use("/api/books", bookroutes);
app.use("/api/orders", orderroutes);
app.use("/api/stats", statsroutes);
app.use("/api/payment", paymentroutes);
app.use("/api/contact", contactroutes);
app.get("/", (req, res) => {
  res.send("<h1>🌿 Reaina's Haven API is Live!</h1><p>The botanical sanctuary backend is running successfully.</p>");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();