const express = require("express");
const router = express.Router();
const {createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderController,
    deleteOrderController
} = require("../controllers/orderController");

router.post("/create", createOrderController);
router.get("/getall", getAllOrdersController);
router.get("/getone/:orderid", getOrderByIdController);
router.put("/update/:orderid", updateOrderController);
router.delete("/delete/:orderid", deleteOrderController);

module.exports = router;
