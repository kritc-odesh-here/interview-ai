const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      default: "local",
      enum: ["local", "google"],
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "dark",
      enum: ["light", "dark"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
