import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";

dotenv.config({ path: "./../.env" });

const products = [
  {
    nombre: "Arroz Integral",
    descripcion:
      "Paquete de arroz integral de 1kg, perfecto para una dieta saludable.",
    categoria: "Alimentos",
    precioBase: 3500,
    img: [
      "https://example.com/arroz-integral-500g.jpg",
      "https://example.com/arroz-integral-1kg.jpg",
    ],
    slug: "arroz-integral",
    moneda: "clp",
  },
  {
    nombre: "Aceite de Oliva",
    descripcion:
      "Aceite de oliva extra virgen de primera prensada, botella de 500ml.",
    categoria: "Aceites",
    precioBase: 6500,
    img: [
      "https://example.com/aceite-oliva-250ml.jpg",
      "https://example.com/aceite-oliva-500ml.jpg",
    ],
    slug: "aceite-oliva",
    moneda: "clp",
  },
];

const generateProducts = async (products) => {
  try {
    for (const product of products) {
      await Product.create(product);
    }
    console.log("Productos creados correctamente.");
  } catch (error) {
    console.error("Error al crear los productos:", error);
  }
};

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoose.connection.db.dropDatabase();
    await generateProducts(products);

    console.log("Base de datos inicializada correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

connectDB();
