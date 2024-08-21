const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    age: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    profilePicture: { type: String },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("User", userSchema);
