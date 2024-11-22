// Importa los modelos de Cart y User
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

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

// Función para crear una orden
exports.createOrder = async (req, res) => {
  // Obtén un identificador de evento de prueba
  const eventID = "test_event_id";
  const email = req.body.email || "test@example.com";

  // Simula una orden exitosa
  const receiptURL = `https://fake-receipt.com/${eventID}`;
  const receiptID = eventID;
  const amount = 1000; // Valor simulado
  const date_created = Date.now();

  // Actualiza el usuario con los datos del recibo simulado
  await User.findOneAndUpdate(
    { email },
    {
      $push: {
        receipts: {
          receiptURL,
          receiptID,
          date_created,
          amount,
        },
      },
    },
    { new: true }
  );

  // Respuesta simulada
  res.json({
    message: "Orden simulada creada exitosamente.",
    receipt: {
      receiptURL,
      receiptID,
      date_created,
      amount,
    },
  });
};

// Función para crear un carrito
exports.createCart = async (req, res) => {
  // Crea un carrito con los datos de la solicitud
  const newCart = await Cart.create(req.body);

  // Envía el nuevo carrito en la respuesta
  res.json({
    cart: newCart,
  });
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
