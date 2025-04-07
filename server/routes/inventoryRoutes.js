const express = require('express');
const router = express.Router();
const {
  getAllInventoryController,
  getVendorInventoryController
} = require('../controllers/inventoryController');

// Admin route
router.get('/admin/inventory', getAllInventoryController);

// Vendor-specific route
router.get('/vendor/inventory/:vendorId', getVendorInventoryController);

module.exports = router;