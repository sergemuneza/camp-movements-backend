// import express from "express";
// import Movement from "../models/Movement.js";
// import Alert from "../models/Alert.js";
// import User from "../models/User.js"; // ✅ Make sure to import this

// const router = express.Router();

// // // POST /api/movements/log
// // router.post("/log", async (req, res) => {
// //   try {
// //     const { personnelId, verifiedBy } = req.body;

// //     // 1️⃣ Find the user by personnelId to get the name
// //     const user = await User.findOne({ personnelId });
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // 2️⃣ Find the last movement to toggle entry/exit
// //     const lastMovement = await Movement.findOne({ personnelId })
// //       .sort({ timestamp: -1 })
// //       .limit(1);

// //     let movementType = "entry";
// //     if (lastMovement && lastMovement.movementType === "entry") {
// //       movementType = "exit";
// //     }

// //     // 3️⃣ Check curfew hours (22:00–05:00)
// //     const currentHour = new Date().getHours();
// //     const isCurfew = currentHour >= 17 || currentHour < 5;

// //     // 4️⃣ Create the movement record
// //     const newMovement = await Movement.create({
// //       personnelId,
// //       personnelName: user.name, // ✅ include name now
// //       movementType,
// //       verifiedBy: verifiedBy || "Gate Clerk",
// //       curfewViolation: isCurfew,
// //     });

// //     // 5️⃣ If curfew violation, create alert
// //     let alert = null;
// //     if (isCurfew) {
// //       const message = `⚠️ Curfew violation detected for ${user.name} (${personnelId}) during ${movementType.toUpperCase()} at ${new Date().toLocaleTimeString()}`;
// //       alert = await Alert.create({ personnelId, message });
// //     }

// //     // 6️⃣ Respond
// //     res.status(201).json({
// //       message: `Movement logged (${movementType.toUpperCase()})`,
// //       movement: newMovement,
// //       alert: alert ? alert.message : null,
// //     });
// //   } catch (error) {
// //     console.error("Error logging movement:", error);
// //     res.status(500).json({ message: "Server error", error });
// //   }
// // });
// // POST /api/movements/log
// router.post("/log", async (req, res) => {
//   try {
//     const { personnelId, verifiedBy } = req.body;

//     // 1️⃣ Find the last movement for toggle
//     const lastMovement = await Movement.findOne({ personnelId })
//       .sort({ timestamp: -1 })
//       .limit(1);

//     let movementType = "entry";
//     if (lastMovement && lastMovement.movementType === "entry") {
//       movementType = "exit";
//     }

//     // 2️⃣ Check curfew hours (22:00–05:00)
//     const currentHour = new Date().getHours();
//     const isCurfew = currentHour >= 22 || currentHour < 5;

//     // 3️⃣ Get user details
//     const user = await User.findOne({ personnelId });

//     // 4️⃣ Create the movement record
//     const newMovement = await Movement.create({
//       personnelId,
//       personnelName: user ? user.name : "Unknown", // 👈 added
//       movementType,
//       verifiedBy: verifiedBy || "Gate Clerk",
//       curfewViolation: isCurfew,
//     });

//     // 5️⃣ If curfew violation, create an alert
//     let alert = null;
//     if (isCurfew) {
//       const message = `⚠️ Curfew violation detected for ${personnelId} during ${movementType.toUpperCase()} at ${new Date().toLocaleTimeString()}`;
//       alert = await Alert.create({ personnelId, message });
//     }

//     // 6️⃣ Respond with name & photo
//     res.status(201).json({
//       message: `Movement logged (${movementType.toUpperCase()})`,
//       movement: {
//         ...newMovement.toObject(),
//         profilePhoto: user ? user.profilePhotoUrl : null, // 👈 added
//       },
//       alert: alert ? alert.message : null,
//     });
//   } catch (error) {
//     console.error("Error logging movement:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });


// // // GET /api/movements/alerts
// // router.get("/alerts", async (req, res) => {
// //   try {
// //     const alerts = await Alert.find().sort({ timestamp: -1 });
// //     res.json(alerts);
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error });
// //   }
// // });

// // // GET /api/movements/alerts
// // router.get("/alerts", async (req, res) => {
// //   try {
// //     const alerts = await Alert.find().sort({ timestamp: -1 });

// //     // Attach personnelName to each alert
// //     const alertsWithNames = await Promise.all(
// //       alerts.map(async (alert) => {
// //         const user = await User.findOne({ personnelId: alert.personnelId });
// //         return {
// //           _id: alert._id,
// //           personnelId: alert.personnelId,
// //           personnelName: user ? user.name : "Unknown",
// //           profilePhoto: user ? user.profilePhoto : null, 
// //           message: alert.message,
// //           resolved: alert.resolved,
// //           timestamp: alert.timestamp,
// //         };
// //       })
// //     );

// //     res.json(alertsWithNames);
// //   } catch (error) {
// //     console.error("Error fetching alerts:", error);
// //     res.status(500).json({ message: "Server error", error });
// //   }
// // });
// // GET /api/movements/alerts
// router.get("/alerts", async (req, res) => {
//   try {
//     const alerts = await Alert.find().sort({ timestamp: -1 });

//     // Attach personnelName and profilePhoto to each alert
//     const alertsWithDetails = await Promise.all(
//       alerts.map(async (alert) => {
//         const user = await User.findOne({ personnelId: alert.personnelId });
//         return {
//           _id: alert._id,
//           personnelId: alert.personnelId,
//           personnelName: user ? user.name : "Unknown",
//           profilePhoto: user ? user.profilePhotoUrl : null, // 👈 added
//           message: alert.message,
//           resolved: alert.resolved,
//           timestamp: alert.timestamp,
//         };
//       })
//     );

//     res.json(alertsWithDetails);
//   } catch (error) {
//     console.error("Error fetching alerts:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // GET /api/movements/current
// router.get('/current', async (req, res) => {
//   try {
//     const movements = await Movement.aggregate([
//       {
//         $sort: { timestamp: -1 }
//       },
//       {
//         $group: {
//           _id: "$personnelId",
//           lastMovement: { $first: "$movementType" },
//           personnelName: { $first: "$personnelName" },
//           profilePhoto: { $first: "$profilePhoto" },
//           timestamp: { $first: "$timestamp" }
//         }
//       },
//       { $match: { lastMovement: "entry" } } // currently inside
//     ]);
//     res.json(movements);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // GET /api/movements/history
// router.get('/history', async (req, res) => {
//   try {
//     const movements = await Movement.find().sort({ timestamp: -1 });
//     res.json(movements);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// export default router;
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
    const isCurfew = currentHour >= 11 || currentHour < 5;

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

    // 5️⃣ If curfew violation, create an alert with name
    let alert = null;
    if (isCurfew) {
      const message = `⚠️ Curfew violation detected for ${personnelId} during ${movementType.toUpperCase()} at ${new Date().toLocaleTimeString()}`;
      alert = await Alert.create({ 
        personnelId, 
        personnelName: user ? user.name : "Unknown",  // 👈 Added
        message 
      });
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
    res.status(500).json({ message: "Server error", error: error.message });
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
          personnelName: user ? user.name : alert.personnelName || "Unknown", // 👈 Fallback to stored name
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/movements/current
router.get('/current', async (req, res) => {
  try {
    const movements = await Movement.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$personnelId",
          lastMovement: { $first: "$movementType" },
          personnelName: { $first: "$personnelName" },
          timestamp: { $first: "$timestamp" }
        }
      },
      { $match: { lastMovement: "entry" } }
    ]);

    // 👇 Enrich with user details (profilePhoto)
    const enrichedMovements = await Promise.all(
      movements.map(async (movement) => {
        const user = await User.findOne({ personnelId: movement._id });
        return {
          ...movement,
          profilePhoto: user ? user.profilePhotoUrl : null,
          rank: user ? user.rank : null,
          unit: user ? user.unit : null,
        };
      })
    );

    res.json(enrichedMovements);
  } catch (err) {
    console.error("Error fetching current personnel:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/movements/history
router.get('/history', async (req, res) => {
  try {
    const movements = await Movement.find().sort({ timestamp: -1 });

    // 👇 Enrich with user details (profilePhoto, rank, unit)
    const enrichedMovements = await Promise.all(
      movements.map(async (movement) => {
        const user = await User.findOne({ personnelId: movement.personnelId });
        return {
          ...movement.toObject(),
          profilePhoto: user ? user.profilePhotoUrl : null,
          rank: user ? user.rank : null,
          unit: user ? user.unit : null,
        };
      })
    );

    res.json(enrichedMovements);
  } catch (err) {
    console.error("Error fetching movement history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;