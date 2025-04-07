// inventoryController.js
const productModel = require("../models/productModel");
const vendorModel = require("../models/vendorModel");

// Admin: Get stock and availability of all products
const getAllInventoryController = async (req, res) => {
  try {
    const allProducts = await productModel.find().populate("vendor", "name businessName email");

    const inventory = allProducts.map((product) => ({
      productId: product._id,
      name: product.name,
      stock: product.stock,
      available: product.stock > 0,
      vendor: product.vendor
    }));

    res.status(200).json({ success: true, inventory });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Vendor: Get stock and availability of products by vendor ID
const getVendorInventoryController = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const vendorExists = await vendorModel.findById(vendorId);
    if (!vendorExists) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const vendorProducts = await productModel.find({ vendor: vendorId });

    const inventory = vendorProducts.map((product) => ({
      productId: product._id,
      name: product.name,
      stock: product.stock,
      available: product.stock > 0
    }));

    res.status(200).json({ success: true,
        vendorId: vendorExists._id,
         vendor: vendorExists.name,
          inventory
         });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllInventoryController,
  getVendorInventoryController
};
