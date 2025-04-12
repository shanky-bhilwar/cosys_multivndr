const express = require("express");
const {userfcmtokenController} = require("../controllers/userController");

const router = express.Router();

// 1. List this vendor’s products (with images)
router.post("/save-fcm-token/:userId", userfcmtokenController);


module.exports = router;