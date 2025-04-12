const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: Number, default: 0 },
  address:  { type: String },
  fcmTokens:[{ type: String }]      // ← store device tokens token from firebase that we need for the user identification so we can push notifications
});

module.exports = mongoose.model("userModel", userSchema);


