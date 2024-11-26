import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    precioBase: { type: Number, required: true, min: 0 },
    img: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    moneda: { type: String, required: true, default: "USD" },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creadoEn: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
