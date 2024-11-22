const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precioBase, img, slug, moneda } =
      req.body;

    const product = await Product.create({
      nombre,
      descripcion,
      categoria,
      precioBase,
      img,
      slug,
      moneda: moneda || "USD", // Moneda predeterminada
      usuarioId: req.user.id,
    });

    res.status(201).json({
      message: "Producto creado con éxito",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: "Error al crear el producto", error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("usuarioId", "nombre email");

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

    const product = await Product.findById(id).populate(
      "usuarioId",
      "nombre email"
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto encontrado con éxito",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el producto",
      error,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria, precioBase, img, slug, moneda } =
    req.body;

  try {
    const updateData = {};

    if (nombre) updateData.nombre = nombre;
    if (descripcion) updateData.descripcion = descripcion;
    if (categoria) updateData.categoria = categoria;
    if (precioBase !== undefined) updateData.precioBase = precioBase;
    if (img) updateData.img = img;
    if (slug) updateData.slug = slug;
    if (moneda) updateData.moneda = moneda;

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
    res.status(400).json({
      message: "Error al actualizar el producto",
      error,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto eliminado con éxito",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto",
      error: error.message,
    });
  }
};
