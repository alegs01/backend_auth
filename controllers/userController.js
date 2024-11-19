const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  try {
    const user = await User.create({ nombre, correo, contraseña });
    res.status(201).json({
      id: user._id,
      nombre: user.nombre,
      correo: user.correo,
    });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const user = await User.findOne({ correo });
    if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
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

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contraseña } = req.body;

  try {
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (correo) updateData.correo = correo;
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      updateData.contraseña = await bcrypt.hash(contraseña, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el usuario", error });
  }
};

exports.getAllUsers = async (req, res) => {
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
