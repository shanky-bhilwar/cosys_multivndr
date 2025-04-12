// new models/productModel.js 
// models/productModel.js
// old product model where the reference we took is from the user model and our api's are working with that 
// but we are changing that and will take reference from the vendor model and also added the image where we save the links of the images which are stored on cloudinary, if any error occurs in api's later we can take actions from here 
// const mongoose = require("mongoose");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    category:    { type: String, required: true },
    stock:       { type: Number, required: true, default: 1 },
    images:      [{ type: String, required: true }],            // Cloudinary URLs
    vendor:      { type: mongoose.Schema.Types.ObjectId,         // Vendor reference
                   ref: "vendorModel",
                   required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);




// old product model where the reference we took is from the user model and our api's are working with that 
// but we are changing that and will take reference from the vendor model , if any error occurs in api's later we can take actions from here 
// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   description: String,
//   category: String,
//   stock: Number,
//   vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// });

// module.exports = mongoose.model("productModel", ProductSchema);
