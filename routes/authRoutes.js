// // import express from "express";
// // import { signup, login } from "../controllers/authController.js";
// // import upload from "../middlewares/upload.js";

// // const router = express.Router();

// // // Signup route
// // router.post("/signup", upload.single("profilePicture"), signup);

// // // Login route
// // router.post("/login", login);

// // export default router;
// import express from "express";
// import { signup, login } from "../controllers/authController.js";
// import upload from "../middlewares/upload.js"; // make sure this is your Multer config

// const router = express.Router();

// // Signup route with profile photo upload
// // Field name must match what frontend/Postman uses: 'profilePhoto'
// router.post("/signup", upload.single("profilePhoto"), signup);

// // Login route
// router.post("/login", login);

// export default router;
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
