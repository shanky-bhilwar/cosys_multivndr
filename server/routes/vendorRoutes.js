// routes/vendorRoutes.js
const express = require("express");
const {
  getVendorProductsController,
  getVendorSalesController,
  getVendorOrdersController,
  getVendorStatsController
} = require("../controllers/vendorController");

const router = express.Router();

// 1. List this vendor’s products (with images)
router.get("/:vendorId/products", getVendorProductsController);

// 2. Total sales (revenue) for this vendor
router.get("/:vendorId/sales", getVendorSalesController);

// 3. Orders containing this vendor’s products
router.get("/:vendorId/orders", getVendorOrdersController);

// 4. Summary stats: productCount, orderCount, totalRevenue
router.get("/:vendorId/stats", getVendorStatsController);

module.exports = router;