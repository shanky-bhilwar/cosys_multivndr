// models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "userModel",   required: true },
    vendor:      { type: mongoose.Schema.Types.ObjectId, ref: "vendorModel", required: true },  // New vendor field
    items: [
      {
        product:  { type: Object, required: true },   // full product object
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    totalAmount:   { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending","completed"], default: "pending" },
    address:       { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);



// new old "order model " in new one we added the vendor field where we will have the object id of vendor from there .

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.ObjectId, ref: "User", required: true },
//     items: [
//       {
//         product: { type: Object, required: true }, // Storing the product details
//         quantity: { type: Number, required: true, min: 1 },
//       }
//     ],
//     totalAmount: { type: Number, required: true },
//     paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
//     address: { type: String, required: true } // Added Address Field
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);









//old order model if any error occur after the new order model use this 

// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   items: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       quantity: Number
//     }
//   ],
//   totalAmount: Number,
//   status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" }
// });

// module.exports = mongoose.model("Order", OrderSchema);
