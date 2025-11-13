// import User from "../models/User.js";
// import Movement from "../models/Movement.js";

// // Curfew hour in 24h format
// const CURFEW_HOUR = 22;

// // export const logMovement = async (req, res) => {
// //   const { qrData, movementType, gateClerkName } = req.body;
// //   // gateClerkName: name of the gate clerk logging this movement

// //   try {
// //     // Decode QR data (format: userId:personnelId:role)
// //     const [userId, personnelId, role] = qrData.split(":");

// //     const user = await User.findById(userId);
// //     if (!user) return res.status(404).json({ message: "User not found" });

// //     // Determine curfew violation
// //     let curfewViolation = false;
// //     if (movementType === "entry") {
// //       const nowHour = new Date().getHours();
// //       if (nowHour >= CURFEW_HOUR) curfewViolation = true;
// //     }

// //     // Log movement
// //     const movement = await Movement.create({
// //       personnelId,
// //       movementType,
// //       timestamp: new Date(),
// //       verifiedBy: gateClerkName || "Gate Clerk",
// //       curfewViolation,
// //     });

// //     res.json({ message: "Movement logged", movement });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// export const logMovement = async (req, res) => {
//   const { qrData, movementType, gateClerkName } = req.body;

//   try {
//     // Check if qrData is base64 or text
//     let userId, personnelId, role;

//     if (qrData.includes(":")) {
//       // ✅ Format: userId:personnelId:role
//       [userId, personnelId, role] = qrData.split(":");
//     } else {
//       // ⚠️ The qrData is an image (base64), so reject it
//       return res.status(400).json({
//         message: "Invalid QR data. Expected text in format userId:personnelId:role",
//       });
//     }

//     // Find user
//     const user = await User.findById(userId);
//     if (!user)
//       return res.status(404).json({ message: "User not found for this QR" });

//     // Determine curfew violation
//     const currentHour = new Date().getHours();
//     const curfewViolation =
//       movementType === "entry" && currentHour >= CURFEW_HOUR;

//     // Log movement
//     const movement = await Movement.create({
//       personnelId,
//       personnelName: user.name, // ✅ Save the name now
//       movementType,
//       timestamp: new Date(),
//       verifiedBy: gateClerkName || "Gate Clerk",
//       curfewViolation,
//     });

//     res.status(201).json({
//       message: "✅ Movement logged successfully",
//       movement,
//     });
//   } catch (error) {
//     console.error("Error logging movement:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// }; Movement Contrroleer the updated one
import express from "express";
import Movement from "../models/Movement.js";
import Alert from "../models/Alert.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/movements/log
router.post("/log", async (req, res) => {
  try {
    const { personnelId, verifiedBy } = req.body;

    // 1️⃣ Find the last movement for toggle
    const lastMovement = await Movement.findOne({ personnelId })
      .sort({ timestamp: -1 })
      .limit(1);

    let movementType = "entry";
    if (lastMovement && lastMovement.movementType === "entry") {
      movementType = "exit";
    }

    // 2️⃣ Check curfew hours (22:00–05:00)
    const currentHour = new Date().getHours();
    const isCurfew = currentHour >= 22 || currentHour < 5;

    // 3️⃣ Get user details
    const user = await User.findOne({ personnelId });

    // 4️⃣ Create the movement record
    const newMovement = await Movement.create({
      personnelId,
      personnelName: user ? user.name : "Unknown",
      movementType,
      verifiedBy: verifiedBy || "Gate Clerk",
      curfewViolation: isCurfew,
    });

    // 5️⃣ If curfew violation, create an alert
    let alert = null;
    if (isCurfew) {
      const message = `⚠️ Curfew violation detected for ${personnelId} during ${movementType.toUpperCase()} at ${new Date().toLocaleTimeString()}`;
      alert = await Alert.create({ personnelId, message });
    }

    // 6️⃣ Respond with name & photo
    res.status(201).json({
      message: `Movement logged (${movementType.toUpperCase()})`,
      movement: {
        ...newMovement.toObject(),
        profilePhoto: user ? user.profilePhotoUrl : null,
      },
      alert: alert ? alert.message : null,
    });
  } catch (error) {
    console.error("Error logging movement:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET /api/movements/alerts
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });

    const alertsWithDetails = await Promise.all(
      alerts.map(async (alert) => {
        const user = await User.findOne({ personnelId: alert.personnelId });
        return {
          _id: alert._id,
          personnelId: alert.personnelId,
          personnelName: user ? user.name : "Unknown",
          profilePhoto: user ? user.profilePhotoUrl : null,
          message: alert.message,
          resolved: alert.resolved,
          timestamp: alert.timestamp,
        };
      })
    );

    res.json(alertsWithDetails);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
