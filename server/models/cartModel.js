const mongoose = require('mongoose');
const userModel = require('./userModel');  // Importing the userModel
const productModel = require('./productModel');  // Importing the productModel

//we made two models here "item" and "cart" cz we need item schema to put in the cart schema inside the items field as an array , 
// and we can also make seperate file for the item schema but for that we might get confuse that whats the use of this file so 
// "we are making both schema in one fiile" so we can figure it out that we put the item in cart schema of its field and we will only make 
//we will only make model of cart schema no need to make item model and will exoprt the cart model only



const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Object, required: true }, // Store the entire product object
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  });
  

console.log("model is logging that means....")

module.exports = mongoose.model('cartModel', cartSchema);



// const cartSchema = new mongoose.Schema({
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'user',
//       required: true
//     },
//     items: [
//       {
//         product: {
//           _id: mongoose.Schema.Types.ObjectId,
//           name: String,
//           price: Number,
//           description: String,
//           category: String,
//           stock: Number,
//           vendor: mongoose.Schema.Types.ObjectId
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1
//         }
//       }
//     ]
//   });
  
//   module.exports = mongoose.model('Cart', cartSchema);








//-------------------- arawind cart model - working --

// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true, // Each user has one cart
//   },
//   items: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//       vendor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Vendor',
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//         default: 1,
//       },
//     },
//   ],
// }, { timestamps: true });

// export default mongoose.model('Cart', cartSchema);