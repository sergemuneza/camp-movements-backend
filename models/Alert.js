import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  personnelId: {
    type: String,
    required: true,
  },

  personnelName: {    // 👈 optional for clarity
    type: String,
  },

  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
