// Importa los modelos de Cart y User
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const mercadopago = require("mercadopago");

const client = new mercadopago.MercadoPagoConfig({
  accessToken:
    "APP_USR-1103948530982831-112217-bef9ec8c4c9ae00a98e3fd97a3c92df7-221707668",
});

const preferences = new mercadopago.Preference(client);

// Función para crear una sesión de checkout de prueba
exports.createCheckoutSession = async (req, res) => {
  // Obtiene el ID del usuario de la solicitud
  const userID = req.user.id;

  // Encuentra al usuario en la base de datos por su ID
  const foundUser = await User.findOne({ _id: userID });

  // Encuentra el carrito del usuario en la base de datos y llena los productos
  const foundCart = await Cart.findById(foundUser.cart).populate({
    path: "products",
  });

  // Crea line_items simulados para el proceso de pago
  const line_items = foundCart.products.map((e) => {
    return {
      name: e.name,
      quantity: e.quantity,
      price: e.price,
    };
  });

  // Respuesta simulada
  res.json({
    message: "Sesión de checkout simulada creada.",
    line_items,
  });
};

exports.createOrder = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Correo es obligatorio" });
  }

  try {
    const foundUser = await User.findOne({ email }).populate("cart");

    if (!foundUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!foundUser.cart || foundUser.cart.products.length === 0) {
      return res
        .status(400)
        .json({ message: "El carrito está vacío o no está asociado" });
    }

    const { products } = foundUser.cart;

    const preference = {
      items: products.map((product) => ({
        title: product.name,
        quantity: product.quantity,
        unit_price: product.price,
        currency_id: "USD",
      })),
      payer: {
        email,
      },
      back_urls: {
        success: "http://www.tu_dominio.com/success",
        failure: "http://www.tu_dominio.com/failure",
        pending: "http://www.tu_dominio.com/pending",
      },
      auto_return: "approved",
    };

    const response = await preferences.create(preference);

    res.status(200).json({
      init_point: response.body.init_point,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};

// Función para crear un carrito
exports.createCart = async (req, res) => {
  const { products } = req.body;

  // Obtener el ID del usuario desde `req.user`
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "No se encontró el usuario autenticado" });
  }

  try {
    // Crea un nuevo carrito
    const newCart = await Cart.create({ products });

    // Encuentra al usuario y vincula el carrito
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart: newCart._id },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(201).json({
      message: "Carrito creado y asociado al usuario",
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error });
  }
};

exports.getUserCart = async (req, res) => {
  const { email } = req.query;

  try {
    const foundUser = await User.findOne({ email }).populate("cart");

    if (!foundUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!foundUser.cart) {
      return res
        .status(404)
        .json({ message: "El usuario no tiene un carrito asociado" });
    }

    res.status(200).json({
      cart: foundUser.cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el carrito del usuario", error });
  }
};

// Función para obtener un carrito
exports.getCart = async (req, res) => {
  // Obtiene el ID del usuario de la solicitud
  const userID = req.user.id;

  // Encuentra al usuario en la base de datos por su ID
  const foundUser = await User.findOne({ _id: userID });

  // Encuentra el carrito del usuario en la base de datos
  const foundCart = await Cart.findOne({ _id: foundUser.cart });

  // Envía el carrito encontrado en la respuesta
  res.json({
    cart: foundCart,
  });
};

// Función para editar un carrito
exports.editCart = async (req, res) => {
  // Obtiene el ID del usuario de la solicitud
  const userID = req.user.id;

  // Encuentra al usuario en la base de datos por su ID
  const foundUser = await User.findOne({ _id: userID });

  // Toma los nuevos datos de los productos de la solicitud
  const { products } = req.body;

  // Actualiza el carrito con los nuevos datos de los productos
  const updatedCart = await Cart.findByIdAndUpdate(
    foundUser.cart,
    {
      products,
    },
    { new: true }
  );

  // Envía un mensaje y el carrito actualizado en la respuesta
  res.json({
    msg: "Tu carrito fue actualizado",
    updatedCart,
  });
};
