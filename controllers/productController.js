const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      usuarioId: req.user.id,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error });
  }
};
