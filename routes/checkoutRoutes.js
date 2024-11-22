const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *  schemas:
 *    Cart:
 *      type: object
 *      properties:
 *        products:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              quantity:
 *                type: number
 *              priceID:
 *                type: string
 *              name:
 *                type: string
 *              priceDescription:
 *                type: string
 *              price:
 *                type: number
 *              img:
 *                type: string
 *              slug:
 *                type: string
 *      required:
 *        - products
 *      example:
 *        products:
 *          - quantity: 1
 *            priceID: "1"
 *            name: "Producto A"
 *            priceDescription: "USD"
 *            price: 1.99
 *            img: "url_imagen"
 *            slug: "producto-a"
 */

/**
 * @swagger
 * /api/checkout/create-checkout-session:
 *   get:
 *     summary: Crear sesión de pago simulada
 *     description: Crea una sesión de pago para simular el proceso de checkout.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión de pago creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 line_items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 */
router.get(
  "/create-checkout-session",
  authMiddleware,
  checkoutController.createCheckoutSession
);

/**
 * @swagger
 * /api/checkout/create-order:
 *   post:
 *     summary: Crear una orden simulada
 *     description: Procesa una orden simulada y actualiza la base de datos.
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orden creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 receipt:
 *                   type: object
 *                   properties:
 *                     receiptURL:
 *                       type: string
 *                     receiptID:
 *                       type: string
 *                     date_created:
 *                       type: string
 *                       format: date-time
 *                     amount:
 *                       type: number
 */
router.post(
  "/create-order",
  express.raw({ type: "application/json" }),
  checkoutController.createOrder
);

/**
 * @swagger
 * /api/checkout/create-cart:
 *   post:
 *     summary: Crear un nuevo carrito de compras
 *     description: Crea un carrito de compras en la base de datos.
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Carrito creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 */
router.post("/create-cart", checkoutController.createCart);

/**
 * @swagger
 * /api/checkout/get-cart:
 *   get:
 *     summary: Obtener carrito de compras
 *     description: Obtiene el carrito asociado al usuario autenticado.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito de compras encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get("/get-cart", authMiddleware, checkoutController.getCart);

/**
 * @swagger
 * /api/checkout/edit-cart:
 *   put:
 *     summary: Editar carrito de compras
 *     description: Edita los productos en el carrito de compras del usuario autenticado.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Carrito de compras actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 updatedCart:
 *                   $ref: '#/components/schemas/Cart'
 */
router.put("/edit-cart", authMiddleware, checkoutController.editCart);

module.exports = router;
