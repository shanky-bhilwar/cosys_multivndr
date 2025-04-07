const express = require('express')
const router = express.Router();
const {addItemCartController, 
    deleteItemCartController,
    getTotalCartController, 
    syncCartController,
    getAllCartsController,
    getUserCartController} = require('../controllers/cartController')

router.post('/add/:userId', addItemCartController);
router.delete('/delete/:userId/:productId', deleteItemCartController);
router.get('/total/:userId',getTotalCartController)
router.put('/sync/:userId',syncCartController)
router.get("/getall", getAllCartsController); // Get all carts
router.get("/getone/:userId", getUserCartController); // Get a specific user's cart


module.exports = router;