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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Lista de productos obtenida con éxito",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto encontrado con éxito",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al encontrar el producto",
      error,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  try {
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion) updateData.descripcion = descripcion;
    if (precio) updateData.precio = precio;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto actualizado con éxito",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el producto", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Producto eliminado con éxito", deletedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", error: error.message });
  }
};
