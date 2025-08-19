// controllers/productController.js
const { Product } = require("../config/database");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const imageUrl = req.file?.path || ""; // from multer
    const product = await Product.create({ name, description, price, stock, category, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const imageUrl = req.file?.path || product.imageUrl;

  await product.update({ name, description, price, stock, category, imageUrl });
  res.json({ message: "Product updated", product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.destroy();
  res.json({ message: "Product deleted" });
};
