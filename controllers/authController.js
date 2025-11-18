//Auth Controller 
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateQRCode } from "../utils/generateQR.js";
import * as crypto from "crypto";
import nodemailer from "nodemailer";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// -------------------------
// 📝 Signup
// -------------------------
export const signup = async (req, res) => {
  const { name, personnelId, email, rank, unit, role, password } = req.body;

  try {
    console.log("📥 ========== SIGNUP REQUEST ==========");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("=====================================");

    // Validate required fields
    if (!name || !personnelId || !email || !rank || !unit || !password) {
      console.log("❌ Missing fields detected");
      return res.status(400).json({
        message: "Missing required fields",
        received: { name, personnelId, email, rank, unit, role },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate profile photo
    if (!req.file) {
      console.log("❌ No profile photo uploaded");
      return res.status(400).json({ message: "Profile photo is required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ personnelId }, { email }] });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with all fields
    const userData = {
      name,
      personnelId,
      email,
      rank,
      unit,
      role: role || "Personnel",
      password,
      profilePhotoUrl: `/uploads/${req.file.filename}`,
    };

    console.log("Creating user with data:", userData);

    const user = await User.create(userData);

    console.log("✅ User created in DB:");
    console.log("- ID:", user._id);
    console.log("- Name:", user.name);
    console.log("- Rank:", user.rank);
    console.log("- Unit:", user.unit);
    console.log("- Email:", user.email);
    console.log("- Profile Photo:", user.profilePhotoUrl);

    // Generate QR code
    const qrText = `${user._id}:${personnelId}:${role || "Personnel"}`;
    const qrToken = await generateQRCode(qrText);
    user.qrToken = qrToken;
    await user.save();

    console.log("✅ QR Token generated and saved");

    const responseData = {
      _id: user._id,
      name: user.name,
      personnelId: user.personnelId,
      email: user.email,
      rank: user.rank,
      unit: user.unit,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
      qrToken,
      token: generateToken(user._id, user.role),
    };

    console.log("📤 Sending response:", responseData);

    res.status(201).json(responseData);
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------------
// 📝 Login - WITH DEBUGGING
// -------------------------
export const login = async (req, res) => {
  const { personnelId, password } = req.body;

  try {
    console.log("📥 ========== LOGIN REQUEST ==========");
    console.log("Personnel ID:", personnelId);
    console.log("=====================================");

    // Find user
    const user = await User.findOne({ personnelId });
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found in DB:");
    console.log("- ID:", user._id);
    console.log("- Name:", user.name);
    console.log("- Rank:", user.rank);
    console.log("- Unit:", user.unit);
    console.log("- Email:", user.email);
    console.log("- Profile Photo:", user.profilePhotoUrl);
    console.log("- Role:", user.role);
    console.log("- QR Token:", user.qrToken ? "Present" : "Missing");

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password matched");

    // Prepare response with ALL user data
    const responseData = {
      _id: user._id,
      name: user.name,
      personnelId: user.personnelId,
      email: user.email,
      rank: user.rank,
      unit: user.unit,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
      qrToken: user.qrToken,
      token: generateToken(user._id, user.role),
    };

    console.log("📤 Sending login response:");
    console.log(JSON.stringify(responseData, null, 2));
    console.log("=====================================");

    res.json(responseData);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------------
// 📝 Forgot Password
// -------------------------
export const forgotPassword = async (req, res) => {
  const { personnelId } = req.body;

  try {
    const user = await User.findOne({ personnelId });
    if (!user) return res.status(404).json({ message: "No user found with that personnel ID" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email to real user email
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset Request</h3>
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password. It expires in 15 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Password reset link sent successfully." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------------
// 📝 Reset Password
// -------------------------
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};