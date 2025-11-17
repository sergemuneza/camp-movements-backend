import express from "express";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/users/count - Get total registered personnel count
router.get("/count", protect, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/users - Get all users (for admin purposes)
router.get("/", protect, async (req, res) => {
  try {
    // Only commanders can view all users
    if (req.user.role !== "Commander") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/users/:id - Get single user
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;