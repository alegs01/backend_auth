const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  try {
    const user = await User.create({ nombre, correo, contraseña });
    res.status(201).json(user);
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
