// import mongoose from "mongoose";

// const alertSchema = new mongoose.Schema({
//   personnelId: {
//     type: String,
//     required: true,
//   },

//   personnelName: {    // 👈 optional for clarity
//     type: String,
//   },

//   message: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   resolved: {
//     type: Boolean,
//     default: false,
//   },
// });

// const Alert = mongoose.model("Alert", alertSchema);
// export default Alert;

import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  personnelId: {
    type: String,
    required: true,
    index: true, // 👈 Add index for faster queries
  },
  personnelName: {
    type: String,
    default: "Unknown", // 👈 Add default value
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true, // 👈 Add index for sorting
  },
  resolved: {
    type: Boolean,
    default: false,
    index: true, // 👈 Add index for filtering
  },
});

// 👇 Add compound index for efficient queries
alertSchema.index({ resolved: 1, timestamp: -1 });

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;