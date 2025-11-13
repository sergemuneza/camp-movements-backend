// // // import User from "../models/User.js";
// // // import jwt from "jsonwebtoken";

// // // // Generate JWT Token
// // // const generateToken = (id, role) => {
// // //   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
// // //     expiresIn: "7d",
// // //   });
// // // };

// // // // @desc    Register a new user
// // // // @route   POST /api/auth/signup
// // // // @access  Public
// // // export const signup = async (req, res) => {
// // //   const { name, personnelId, rank, unit, role, password } = req.body;

// // //   try {
// // //     // Check if user exists
// // //     const existingUser = await User.findOne({ personnelId });
// // //     if (existingUser) return res.status(400).json({ message: "User already exists" });

// // //     // Create user
// // //     const user = await User.create({
// // //       name,
// // //       personnelId,
// // //       rank,
// // //       unit,
// // //       role,
// // //       password,
// // //     });

// // //     res.status(201).json({
// // //       _id: user._id,
// // //       name: user.name,
// // //       personnelId: user.personnelId,
// // //       role: user.role,
// // //       token: generateToken(user._id, user.role),
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Server error", error: error.message });
// // //   }
// // // };

// // // // @desc    Login user
// // // // @route   POST /api/auth/login
// // // // @access  Public
// // // export const login = async (req, res) => {
// // //   const { personnelId, password } = req.body;

// // //   try {
// // //     const user = await User.findOne({ personnelId });
// // //     if (!user) return res.status(400).json({ message: "Invalid credentials" });

// // //     const isMatch = await user.matchPassword(password);
// // //     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

// // //     res.json({
// // //       _id: user._id,
// // //       name: user.name,
// // //       personnelId: user.personnelId,
// // //       role: user.role,
// // //       token: generateToken(user._id, user.role),
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Server error", error: error.message });
// // //   }
// // // };
// // import User from "../models/User.js";
// // import jwt from "jsonwebtoken";
// // import { generateQRCode } from "../utils/generateQR.js"; // our QR generator

// // // Generate JWT Token
// // const generateToken = (id, role) => {
// //   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
// //     expiresIn: "7d",
// //   });
// // };

// // // @desc    Register a new user with QR code
// // // @route   POST /api/auth/signup
// // // @access  Public
// // export const signup = async (req, res) => {
// //   const { name, personnelId, rank, unit, role, password } = req.body;

// //   try {
// //     // Check if user exists
// //     const existingUser = await User.findOne({ personnelId });
// //     if (existingUser)
// //       return res.status(400).json({ message: "User already exists" });

// //     // Create user
// //     const user = await User.create({
// //       name,
// //       personnelId,
// //       rank,
// //       unit,
// //       role,
// //       password,
// //     });

// //     // Generate QR code containing unique info (userId:personnelId:role)
// //     const qrText = `${user._id}:${personnelId}:${role}`;
// //     const qrToken = await generateQRCode(qrText);

// //     // Save QR code in user document
// //     user.qrToken = qrToken;
// //     await user.save();

// //     // Respond with user info, JWT token, and QR code
// //     res.status(201).json({
// //       _id: user._id,
// //       name: user.name,
// //       personnelId: user.personnelId,
// //       role: user.role,
// //       qrToken: qrToken, // Base64 QR image
// //       token: generateToken(user._id, user.role),
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };

// // // @desc    Login user
// // // @route   POST /api/auth/login
// // // @access  Public
// // export const login = async (req, res) => {
// //   const { personnelId, password } = req.body;

// //   try {
// //     const user = await User.findOne({ personnelId });
// //     if (!user) return res.status(400).json({ message: "Invalid credentials" });

// //     const isMatch = await user.matchPassword(password);
// //     if (!isMatch)
// //       return res.status(400).json({ message: "Invalid credentials" });

// //     res.json({
// //       _id: user._id,
// //       name: user.name,
// //       personnelId: user.personnelId,
// //       role: user.role,
// //       qrToken: user.qrToken, // Include QR code in login response too
// //       token: generateToken(user._id, user.role),
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import { generateQRCode } from "../utils/generateQR.js"; // QR generator
// import * as crypto from "crypto";
// import nodemailer from "nodemailer";

// // Generate JWT Token
// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // @desc    Register a new user with QR code
// // @route   POST /api/auth/signup
// // @access  Public
// // export const signup = async (req, res) => {
// //   const { name, personnelId, rank, unit, role, password } = req.body;

// //   try {
// //     // Check if user exists
// //     const existingUser = await User.findOne({ personnelId });
// //     if (existingUser)
// //       return res.status(400).json({ message: "User already exists" });

// //     // Create user
// //     const user = await User.create({
// //       name,
// //       personnelId,
// //       rank,
// //       unit,
// //       role,
// //       password,
// //       profilePhotoUrl: profilePhoto ? `/uploads/${profilePhoto.filename}` : undefined
// //     });

// //     // Generate QR code containing unique info (userId:personnelId:role)
// //     const qrText = `${user._id}:${personnelId}:${role}`;
// //     const qrToken = await generateQRCode(qrText);

// //     // Save QR code in user document
// //     user.qrToken = qrToken;
// //     await user.save();

// //     // Respond with user info, JWT token, and QR code
// //     res.status(201).json({
// //       _id: user._id,
// //       name: user.name,
// //       personnelId: user.personnelId,
// //       role: user.role,
// //       qrToken: qrToken, // Base64 QR image
// //       profilePhotoUrl: user.profilePhotoUrl,
// //       token: generateToken(user._id, user.role),
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };


// // //==============================================================
// // export const signup = async (req, res) => {
// //   const { name, personnelId, rank, unit, role, password } = req.body;

// //   try {
// //     const existingUser = await User.findOne({ personnelId });
// //     if (existingUser)
// //       return res.status(400).json({ message: "User already exists" });

// //     const user = await User.create({
// //       name,
// //       personnelId,
// //       rank,
// //       unit,
// //       role,
// //       password,
// //       profilePhotoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
// //     });

// //     // Generate QR code
// //     const qrText = `${user._id}:${personnelId}:${role}`;
// //     const qrToken = await generateQRCode(qrText);
// //     user.qrToken = qrToken;
// //     await user.save();

// //     res.status(201).json({
// //       _id: user._id,
// //       name: user.name,
// //       personnelId: user.personnelId,
// //       role: user.role,
// //       profilePhotoUrl: user.profilePhotoUrl,
// //       qrToken,
// //       token: generateToken(user._id, user.role),
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// // //=============================================================

// export const signup = async (req, res) => {
//   const { name, personnelId, rank, unit, role, password } = req.body;

//   try {
//     console.log('📥 Signup request received');
//     console.log('Body:', req.body);
//     console.log('File:', req.file);

//     // Validate required fields
//     if (!name || !personnelId || !rank || !unit || !password) {
//       return res.status(400).json({ 
//         message: "Missing required fields",
//         received: { name, personnelId, rank, unit, role }
//       });
//     }

//     // ✅ Validate profile photo is required
//     if (!req.file) {
//       return res.status(400).json({ 
//         message: "Profile photo is required" 
//       });
//     }

//     const existingUser = await User.findOne({ personnelId });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const user = await User.create({
//       name,
//       personnelId,
//       rank,
//       unit,
//       role: role || "Personnel",
//       password,
//       profilePhotoUrl: `/uploads/${req.file.filename}`, // Now always has a value
//     });

//     // Generate QR code
//     const qrText = `${user._id}:${personnelId}:${role || "Personnel"}`;
//     const qrToken = await generateQRCode(qrText);
//     user.qrToken = qrToken;
//     await user.save();

//     console.log('✅ User created successfully:', user.personnelId);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       personnelId: user.personnelId,
//       role: user.role,
//       profilePhotoUrl: user.profilePhotoUrl,
//       qrToken,
//       token: generateToken(user._id, user.role),
//     });
//   } catch (error) {
//     console.error('❌ Signup error:', error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// export const login = async (req, res) => {
//   const { personnelId, password } = req.body;

//   try {
//     const user = await User.findOne({ personnelId });
//     if (!user)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       personnelId: user.personnelId,
//       role: user.role,
//       qrToken: user.qrToken, // Include QR code in login response
//       token: generateToken(user._id, user.role),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// export const forgotPassword = async (req, res) => {
//   const { personnelId } = req.body;

//   try {
//     const user = await User.findOne({ personnelId });
//     if (!user) {
//       return res.status(404).json({ message: "No user found with that personnel ID" });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
//     await user.save();

//     // Email setup (for testing use your Gmail or any SMTP service)
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     await transporter.sendMail({
//       to: user.personnelId + "@yourcampdomain.com", // Adjust if using real emails
//       subject: "Password Reset Request",
//       html: `
//         <h3>Password Reset Request</h3>
//         <p>Hello ${user.name},</p>
//         <p>Click the link below to reset your password. It expires in 15 minutes:</p>
//         <a href="${resetLink}">${resetLink}</a>
//       `,
//     });

//     res.json({ message: "Password reset link sent successfully." });
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // -------------------------
// // 🔑 Reset Password
// // -------------------------
// export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() }, // check expiry
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     user.password = newPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful! You can now log in." });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
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
    console.log("📥 Signup request received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // Validate required fields
    if (!name || !personnelId || !email || !rank || !unit || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        received: { name, personnelId, email, rank, unit, role },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate profile photo
    if (!req.file) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ personnelId }, { email }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = await User.create({
      name,
      personnelId,
      email,
      rank,
      unit,
      role: role || "Personnel",
      password,
      profilePhotoUrl: `/uploads/${req.file.filename}`,
    });

    // Generate QR code
    const qrText = `${user._id}:${personnelId}:${role || "Personnel"}`;
    const qrToken = await generateQRCode(qrText);
    user.qrToken = qrToken;
    await user.save();

    console.log("✅ User created successfully:", user.personnelId);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      personnelId: user.personnelId,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
      qrToken,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------------
// 📝 Login
// -------------------------
export const login = async (req, res) => {
  const { personnelId, password } = req.body;

  try {
    const user = await User.findOne({ personnelId });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      personnelId: user.personnelId,
      role: user.role,
      qrToken: user.qrToken,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
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
