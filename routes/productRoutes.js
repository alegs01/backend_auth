import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del producto.
 *         nombre:
 *           type: string
 *           description: Nombre del producto.
 *         descripcion:
 *           type: string
 *           description: Descripción del producto.
 *         categoria:
 *           type: string
 *           description: Categoría del producto.
 *         precioBase:
 *           type: number
 *           description: Precio base del producto.
 *         slug:
 *           type: string
 *           description: Slug del producto.
 *         img:
 *           type: string
 *           description: URL de la imagen del producto.
 *       required:
 *         - nombre
 *         - descripcion
 *         - categoria
 *         - precioBase
 *         - slug
 *         - img
 *       example:
 *         _id: 637bf21f31312991970fdba8
 *         nombre: "Producto Ejemplo"
 *         descripcion: "Este es un producto de prueba."
 *         categoria: "Alimentos"
 *         precioBase: 9000
 *         slug: "carne-molida"
 *         img: "http://example.com/imagen.jpg"
 */

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Crear un producto nuevo
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               precioBase:
 *                 type: number
 *               slug:
 *                 type: string
 *               img:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error al crear el producto
 */
router.post("/create", authMiddleware, createProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               precioBase:
 *                 type: number
 *               slug:
 *                 type: string
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: Error al actualizar el producto
 *       500:
 *         description: Error al actualizar el producto
 */
router.put("/:id", authMiddleware, updateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto
 *     responses:
 *       200:
 *         description: Producto encontrado con éxito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
router.get("/:id", getProduct);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 *       500:
 *         description: Error al obtener los productos
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado con éxito
 *                 product:
 *                   type: object
 *                   description: Información del producto eliminado
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto no encontrado
 *       400:
 *         description: ID de producto no válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID de producto no válido
 *       500:
 *         description: Error al eliminar el producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el producto
 *                 error:
 *                   type: string
 *                   description: Detalle del error
 */
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
