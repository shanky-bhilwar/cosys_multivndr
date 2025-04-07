const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const product = new Product({ name, price, description, category, stock, vendor: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
