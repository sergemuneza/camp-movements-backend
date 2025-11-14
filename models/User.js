// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";

// // const userSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   personnelId: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   rank: {
// //     type: String,
// //     required: true,
// //   },
// //   unit: {
// //     type: String,
// //     required: true,
// //   },
// //   role: {
// //     type: String,
// //     enum: ["Commander", "GateClerk", "Personnel"],
// //     default: "Personnel",
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// //   qrToken: {
// //     type: String,
// //   },
// //   profilePhotoUrl: {
// //     type: String,
// //     default: null,
// //   },

// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // // Hash password before saving
// // userSchema.pre("save", async function(next) {
// //   if (!this.isModified("password")) return next();
// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });

// // // Compare password method
// // userSchema.methods.matchPassword = async function(enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // const User = mongoose.model("User", userSchema);
// // export default User;
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   personnelId: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true }, // 🆕 add email
//   rank: { type: String, required: true },
//   unit: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["Commander", "GateClerk", "Personnel"],
//     default: "Personnel",
//   },
//   password: { type: String, required: true },
//   qrToken: { type: String },
//   profilePhotoUrl: { type: String, default: null },

//   // 🆕 Fields for password reset
//   resetToken: String,
//   resetTokenExpiry: Date,

//   createdAt: { type: Date, default: Date.now },
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// export default User;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    personnelId: {
      type: String,
      required: [true, "Personnel ID is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    rank: {
      type: String,
      required: [true, "Rank is required"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
    },
    role: {
      type: String,
      enum: ["Personnel", "GateClerk", "Commander"],
      default: "Personnel",
    },
    profilePhotoUrl: {
      type: String,
      default: null,
    },
    qrToken: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;