//Movement Controller
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
