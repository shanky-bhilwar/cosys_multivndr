// models/vendorModel.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  address:      { type: String },
  businessName: { type: String },
  role:         { type: Number, default: 1 },    // 1 = vendor
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model("vendorModel", vendorSchema);
