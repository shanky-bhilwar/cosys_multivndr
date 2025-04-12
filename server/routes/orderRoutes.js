const express = require("express");
const router = express.Router();

const {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
  getOrdersByUserController,
  getOrdersByVendorController
} = require("../controllers/orderController");

// Create new order
router.post("/create", createOrderController);

// Get all orders (Admin)
router.get("/allorders", getAllOrdersController);

// Get single order by ID
router.get("/getorderbyid/:orderid", getOrderByIdController);

// Update order
router.put("/updateorder/:orderid", updateOrderController);

// Delete order
router.delete("deleteorder/:orderid", deleteOrderController);

// Get orders by user ID
router.get("/userrder/:userId", getOrdersByUserController);

// Get orders by vendor ID
router.get("/vendororder/:vendorId", getOrdersByVendorController);

module.exports = router;
