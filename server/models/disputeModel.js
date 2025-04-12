const mongoose = require('mongoose');



const disputeSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  vendor:   { type: mongoose.Schema.Types.ObjectId, ref: 'vendorModel', required: true },
  order:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'productModel', required: true },

  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  address:  { type: String, required: true },
  message:  { type: String, required: true },

  status:   { type: String, enum: ['pending','resolved','rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);

