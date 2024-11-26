import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Cart } from "../models/cartModel.js";

export const register = async (req, res) => {
  try {
    const { name, lastname, country, address, zipcode, email, password } =
      req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea el usuario
    const newUser = new User({
      name,
      lastname,
      country,
      address,
      zipcode,
      email,
      password: hashedPassword,
    });

    // Guarda el usuario en la base de datos
    await newUser.save();

    // Crea un carrito asociado al usuario
    const newCart = new Cart({ user: newUser._id });
    await newCart.save();

    // Asocia el carrito al usuario y guarda de nuevo
    newUser.cart = newCart._id;
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: "Error logging in", error });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, email, password, country, address, zipcode } =
    req.body;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    if (country) updateData.country = country;
    if (address) updateData.address = address;
    if (zipcode !== undefined) updateData.zipcode = zipcode;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Lista de usuarios obtenida con éxito",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error,
    });
  }
};
