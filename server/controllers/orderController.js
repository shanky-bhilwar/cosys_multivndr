// Create Order
// controllers/orderController.js
const mongoose = require("mongoose");
const Product = require("../models/productModel");      // important for validation
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const Order = require("../models/orderModel");
const admin = require("../firebaseAdmin");

exports.createOrderController = async (req, res) => {
  try {
    const { user, items, paymentStatus, address, status } = req.body;

    if (!user || !Array.isArray(items) || !items.length || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate each item
    for (const i of items) {
      if (!i.product || !i.vendor || !i.quantity || !i.price) {
        return res.status(400).json({ error: "Each item must have product, vendor, quantity, and price" });
      }
    }

    // Calculate total
    const totalAmount = items.reduce((sum, i) => {
      return sum + i.quantity * i.price;
    }, 0);

    const orderItems = items.map(i => ({
      product: i.product,
      vendor: i.vendor,
      quantity: i.quantity,
    }));

    const newOrder = new Order({
      user,
      items: orderItems,
      totalAmount,
      paymentStatus: paymentStatus || "Pending",
      address,
      status: status || "Pending",
    });

    const saved = await newOrder.save();

    const populated = await Order.findById(saved._id)
      .populate("user", "name email")
      .populate("items.product")
      .populate("items.vendor", "name");

    return res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Error:", err); // This will show actual issue in terminal
    return res.status(500).json({ error: err.message });
  }
};



// Get All Orders
exports.getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .populate("items.vendor", "name");

    return res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching all orders:", err.message);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get One Order
exports.getOrderByIdController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid)
      .populate("user", "name email")
      .populate("items.product", "name price")
      .populate("items.vendor", "name");

    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err.message);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Update Order
// now new update controller which also sends the push notification on order update---

exports.updateOrderController = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    console.log(`🔄 Requested status update: ${status}`);
    
    // Find and update the order status in the database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    console.log(`📦 Finding and updating order: ${orderId}`);

    // Get user info and FCM tokens
    const user = order.user;
    const fcmTokens = user.fcmTokens;
    console.log('✅ Order updated. User info:', user);

    // Prepare message for FCM
    const message = {
      notification: {
        title: 'Order Status Updated',
        body: `Hi ${user.name}, your order ${orderId} is now ${status}.`
      },
      data: { orderId, status },
      tokens: fcmTokens,
    };

    console.log('📲 FCM Tokens found:', fcmTokens);
    console.log('📤 Sending FCM message:', message);

    // Send notification using FCM
    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('✅ Successfully sent message:', response);
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }

    res.status(200).json({ message: 'Order updated and notification sent' });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Delete Order
exports.deleteOrderController = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.orderid);
    if (!deleted) return res.status(404).json({ error: "Order not found" });

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err.message);
    return res.status(500).json({ error: "Failed to delete order" });
  }
};

// Orders By User
exports.getOrdersByUserController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product", "name price")
      .populate("items.vendor", "name");

    return res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err.message);
    return res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// Orders By Vendor
exports.getOrdersByVendorController = async (req, res) => {
  try {
    const orders = await Order.find({ "items.vendor": req.params.vendorId })
      .populate("user", "name email")
      .populate("items.product", "name price")
      .populate("items.vendor", "name");

    return res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching vendor orders:", err.message);
    return res.status(500).json({ error: "Failed to fetch vendor orders" });
  }
};
