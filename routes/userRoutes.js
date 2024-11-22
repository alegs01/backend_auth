const express = require("express");
const {
  register,
  login,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario.
 *         name:
 *           type: string
 *           description: Nombre del usuario.
 *         lastname:
 *           type: string
 *           description: Apellido del usuario.
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario.
 *         country:
 *           type: string
 *           description: País del usuario.
 *         address:
 *           type: string
 *           description: Dirección del usuario.
 *         zipcode:
 *           type: number
 *           description: Código postal del usuario.
 *         cart:
 *           type: string
 *           description: ID del carrito de compras del usuario (referencia a Cart).
 *         receipts:
 *           type: array
 *           items:
 *             type: object
 *           description: Historial de recibos de compras del usuario.
 *       required:
 *         - name
 *         - email
 *         - password
 *       example:
 *         _id: 637bf21f31312991970fdba8
 *         name: "Ejemplo"
 *         lastname: "Apellido"
 *         email: "ejemplo.com"
 *         country: "Chile"
 *         address: "Calle Falsa 123"
 *         zipcode: 12345
 *         cart: "637bf21f31312991970fdba9"
 *         receipts: [{"receiptID": "1234", "amount": 29.99}]
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               zipcode:
 *                 type: number
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error al registrar el usuario
 */
router.post("/register", register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Actualizar la información de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               zipcode:
 *                 type: number
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Datos inválidos proporcionados
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put("/update/:id", authMiddleware, updateUser);

/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del usuario
 *                       nombre:
 *                         type: string
 *                         description: Nombre del usuario
 *                       correo:
 *                         type: string
 *                         description: Correo del usuario
 *       401:
 *         description: Acceso no autorizado
 *       500:
 *         description: Error del servidor al obtener los usuarios
 */
router.get("/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /api/user/verifytoken:
 *   get:
 *     summary: Verificar el token del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get("/verifytoken", authMiddleware, (req, res) => {
  res.json({ message: "Token is valid" });
});

module.exports = router;
