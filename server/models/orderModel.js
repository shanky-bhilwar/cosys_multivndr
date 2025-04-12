// models/orderModel.js

// so here for this task - Allow customers to purchase from multiple vendors in one order
// rn the model show only one vendor id even if we have  multiple products from diff vendors -test this
// so we can copy arawind cart model(commented in cart model file down there) where the vendor id is saved inside the items object with seperate product with its seperate vendor id 
// so by this we can solve this issue and complete this task "kinda"
// const mongoose = require("mongoose");

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",     // matches userModel
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",   // matches products
          required: true,
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "vendorModel",// matches vendorModel
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["completed", "Pending", "Failed"],
      default: "Pending",
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);












// old order model where the vendor id was only one but not for every product so now we have it in new one 
// const orderSchema = new mongoose.Schema(
//   {
//     userId:      { type: mongoose.Schema.Types.ObjectId, ref: "userModel",   required: true },
//     vendor:      { type: mongoose.Schema.Types.ObjectId, ref: "vendorModel", required: true },  // New vendor field
//     items: [
//       {
//         product:  { type: Object, required: true },   // full product object
//         quantity: { type: Number, required: true, min: 1 }
//       }
//     ],
//     totalAmount:   { type: Number, required: true },
//     paymentStatus: { type: String, enum: ["pending","completed"], default: "pending" },
//     address:       { type: String, required: true }
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
