//Movement Model

import mongoose from "mongoose";

const movementSchema = new mongoose.Schema({
  personnelId: {
    type: String,
    required: true,
  },
  personnelName: { // ✅ yes, this is correct and needed
    type: String,
    required: true,
  },
  movementType: {
    type: String,
    enum: ["entry", "exit"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  verifiedBy: {
    type: String,
    default: "Gate Clerk",
  },
  curfewViolation: {
    type: Boolean,
    default: false,
  },
});

const Movement = mongoose.model("Movement", movementSchema);
export default Movement;
