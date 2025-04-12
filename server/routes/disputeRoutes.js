const express = require('express')
const router = express.Router();
const {createDisputeController,
    getVendorDisputesController,
getUserDisputesController,
updateDisputeStatusController} = require('../controllers/disputeController');


// Create a dispute
router.post('/:userId/:orderId/:productId/:vendorId',createDisputeController);

// Fetch vendor’s disputes
router.get('/vendor/:vendorId',getVendorDisputesController);

// Fetch user’s disputes
router.get('/user/:userId',getUserDisputesController);

// Update dispute status
router.patch('/:disputeId/status',updateDisputeStatusController);



module.exports = router;