
import express from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import * as OrderModel from "../controllers/order.controller.js";

const router = express.Router();

// Place a new order
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemsByOutlet } = req.body;
    // Assuming OrderModel.createMany takes userId and itemsByOutlet
    const created = await OrderModel.createMany(userId, itemsByOutlet);
    return res.status(201).json({ created });
  } catch (err) {
    console.error("[Orders] create error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
});

// GET purchased items for the authenticated user
router.get("/purchased", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    console.log("Fetching purchased items for user:", userId); // Debug log

    const items = await OrderModel.getPurchasedItemsByUser(userId);
    console.log("Purchased items fetched:", items); // Debug log

    return res.json(items);
  } catch (err) {
    console.error("[Orders] Failed to fetch purchased items:", err);
    return res.status(500).json({ message: "Failed to fetch purchased items" });
  }
});

export default router;
