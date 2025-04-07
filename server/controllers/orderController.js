const Order = require("../models/orderModel");

// Create Order
exports.createOrderController = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentStatus, address } = req.body;

    const newOrder = new Order({ userId, items, totalAmount, paymentStatus, address });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get All Orders
exports.getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get Single Order
exports.getOrderByIdController = async (req, res) => {
    try {
      console.log("Received Order ID:", req.params.orderid); // Debugging
  
      const order = await Order.findById(req.params.orderid);
      
      if (!order) {
        console.log("Order not found in DB");
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  };

// Update Order
exports.updateOrderController = async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderid,
        req.body, // Update only provided fields
        { new: true }
      );
  
      if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  };

// Delete Order
exports.deleteOrderController = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderid);

    if (!deletedOrder) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};
