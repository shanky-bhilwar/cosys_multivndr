const express = require("express");
const { createProduct, getProducts } = require("../controllers/productController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
// router.get('/getoneproduct',getoneproduct);
// router.get('/deleteproduct',deleteproduct);

module.exports = router;
