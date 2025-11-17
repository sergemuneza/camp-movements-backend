// // import express from "express";
// // import dotenv from "dotenv";
// // import mongoose from "mongoose";
// // import cors from "cors";
// // import authRoutes from "./routes/authRoutes.js";
// // import movementRoutes from "./routes/movementRoutes.js";
// // import userRoutes from "./routes/userRoutes.js";
// // import path from "path";


// // dotenv.config();
// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use("/api/auth", authRoutes);
// // app.use("/api/movements", movementRoutes);
// // app.use("/api/users", userRoutes); // 👈 Add this
// // app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// // // Database Connection
// // mongoose.connect(process.env.MONGO_URI)
// // .then(() => console.log("✅ MongoDB Connected"))
// // .catch(err => console.log("❌ MongoDB Error:", err));

// // // Test route
// // app.get("/", (req, res) => {
// //   res.send("MPMMS Backend is Running...");
// // });

// // // Server start
// // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// // app.listen(PORT, '0.0.0.0', () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import authRoutes from "./routes/authRoutes.js";
// import movementRoutes from "./routes/movementRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files (profile photos)
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// // Serve reset password HTML page
// app.get("/reset-password/:token", (req, res) => {
//   const htmlPath = path.join(__dirname, "public", "reset-password.html");
//   res.sendFile(htmlPath, (err) => {
//     if (err) {
//       console.error("Error serving reset password page:", err);
//       res.status(404).send(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Page Not Found</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//               margin: 0;
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             }
//             .error-box {
//               background: white;
//               padding: 40px;
//               border-radius: 16px;
//               text-align: center;
//               box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//             }
//             h1 { color: #333; }
//             p { color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="error-box">
//             <h1>❌ Page Not Found</h1>
//             <p>The reset password page could not be loaded.</p>
//             <p>Please ensure the <code>public/reset-password.html</code> file exists.</p>
//           </div>
//         </body>
//         </html>
//       `);
//     }
//   });
// });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/movements", movementRoutes);
// app.use("/api/users", userRoutes);

// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.log("❌ MongoDB Error:", err));

// // Test route
// app.get("/", (req, res) => {
//   res.send("MPMMS Backend is Running...");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err.stack);
//   res.status(500).json({ 
//     message: "Something went wrong!", 
//     error: err.message 
//   });
// });

// // Server start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📝 Reset password page available at: http://localhost:${PORT}/reset-password/:token`);
// });
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import movementRoutes from "./routes/movementRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (profile photos)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve assets (logo, images, etc.)
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Serve reset password HTML page
app.get("/reset-password/:token", (req, res) => {
  const htmlPath = path.join(__dirname, "public", "reset-password.html");
  res.sendFile(htmlPath, (err) => {
    if (err) {
      console.error("Error serving reset password page:", err);
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Page Not Found</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .error-box {
              background: white;
              padding: 40px;
              border-radius: 16px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h1>❌ Page Not Found</h1>
            <p>The reset password page could not be loaded.</p>
            <p>Please ensure the <code>public/reset-password.html</code> file exists.</p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/users", userRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("MPMMS Backend is Running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: err.message 
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Reset password page available at: http://localhost:${PORT}/reset-password/:token`);
});