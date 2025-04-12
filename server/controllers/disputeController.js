// controllers/disputeController.js
const Dispute = require('../models/disputeModel');
const Order   = require('../models/orderModel');

/**
 * Create a new dispute
 * POST /api/disputes/:userId/:orderId/:productId/:vendorId
 */
exports.createDisputeController = async (req, res) => {
    const { userId, orderId, productId, vendorId } = req.params;
    const { name, phone, address, message } = req.body;
  
    try {
      const dispute = await Dispute.create({
        user: userId,
        order: orderId,
        product: productId,
        vendor: vendorId,
        name,
        phone,
        address,
        message
      });
      res.json(dispute);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

/**
 * Get all disputes for a given vendor
 * GET /api/disputes/vendor/:vendorId
 */
exports.getVendorDisputesController = async (req, res) => {
    try {
      const vendorId = req.params.vendorId;
      console.log("Fetching disputes for vendor:", vendorId);
  
      const disputes = await Dispute.find({ vendor: vendorId })
        .populate('user', 'name phone address email')
        .populate('vendor', 'businessName')
        .populate({
          path: 'order',
          select: 'items totalAmount createdAt',
          populate: {
            path: 'items.product',
            select: 'name images'
          }
        });
  
      console.log("Fetched disputes:", disputes.length);
  
      const result = disputes.map(d => {
        if (!d.order || !d.order.items) {
          console.warn("Missing order or items in dispute:", d._id);
          return null;
        }
  
        const item = d.order.items.find(i =>
          i.product && i.product._id && d.product && i.product._id.toString() === d.product.toString()
        );
  
        return {
          _id: d._id,
          user: d.user,
          vendor: d.vendor,
          orderId: d.order._id,
          orderDate: d.order.createdAt,
          totalAmount: d.order.totalAmount,
          product: item?.product || null,
          productImage: item?.product?.images?.[0] || null,
          quantity: item?.quantity || 0,
          name: d.name,
          phone: d.phone,
          email: d.email,
          address: d.address,
          message: d.message,
          status: d.status,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt
        };
      }).filter(Boolean); // remove null results
  
      res.json(result);
    } catch (err) {
      console.error('🔥 Error in getVendorDisputesController:', err);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  /**
   * Get all disputes created by a given user
   * GET /api/disputes/user/:userId
   */
  exports.getUserDisputesController = async (req, res) => {
    try {
      const disputes = await Dispute.find({ user: req.params.userId })
        .populate('vendor', 'businessName')
        .populate('order',  'items totalAmount createdAt');
  
      const result = disputes.map(d => {
        const item = d.order.items.find(i => i.product._id.toString() === d.product.toString());
        return {
          _id:         d._id,
          userId:      d.user,
          vendor:      d.vendor,
          orderId:     d.order._id,
          orderDate:   d.order.createdAt,
          totalAmount: d.order.totalAmount,
          product:     item?.product || null,
          productImage: item?.product?.images?.[0] || null, // ✅ added image
          quantity:    item?.quantity || 0,
          name:        d.name,
          phone:       d.phone,
          address:     d.address,
          message:     d.message,
          status:      d.status,
          createdAt:   d.createdAt,
          updatedAt:   d.updatedAt
        };
      });
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
  /**
   * Update dispute status (resolved/rejected)
   * PATCH /api/disputes/:disputeId/status
   */
  exports.updateDisputeStatusController = async (req, res) => {
    const { status } = req.body; // 'resolved' or 'rejected'
    try {
      const updated = await Dispute.findByIdAndUpdate(
        req.params.disputeId,
        { status },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };