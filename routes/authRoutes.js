// //authRoutes.js

// import express from "express";
// import { signup, login, forgotPassword, resetPassword } from "../controllers/authController.js";
// import upload from "../middlewares/upload.js";

// const router = express.Router();

// router.post("/signup", upload.single("profilePhoto"), signup);
// router.post("/login", login);

// // 🆕 Password reset routes
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// export default router;
import express from "express";
import multer from "multer";
import { signup, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { storage } from "../config/cloudinary.js"; // Import Cloudinary storage

const router = express.Router();

// Use Cloudinary storage instead of local storage
const upload = multer({ storage });

router.post("/signup", upload.single("profilePhoto"), signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
