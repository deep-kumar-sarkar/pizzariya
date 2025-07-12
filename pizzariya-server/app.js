import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import outletRoutes from "./routes/outlet.routes.js";
import orderRoutes from "./routes/order.routes.js";
import menuRoutes from "./routes/menu.routes.js";

dotenv.config();
const app = express();

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local development
    "https://pizzariya.vercel.app", // Replace with your actual Vercel domain
    /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel subdomains
    /^https:\/\/.*\.vercel\.app\/.*$/, // Allow Vercel subdomains with paths
  ],
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

export default app;
