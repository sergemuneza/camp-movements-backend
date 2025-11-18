//authRoutes.js

import express from "express";
import { signup, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/signup", upload.single("profilePhoto"), signup);
router.post("/login", login);

// 🆕 Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
