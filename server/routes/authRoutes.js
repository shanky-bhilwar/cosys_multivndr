const express = require("express");
const {  login, registerController } = require("../controllers/authController");
const {registerVendor,loginVendor} = require("../controllers/authController")

const router = express.Router();

router.post("/register", registerController);
router.post("/login", login);

router.post("/register/vendor",registerVendor)
router.post("/login/vendor",loginVendor)

module.exports = router;
