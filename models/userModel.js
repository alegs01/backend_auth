import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    default: "",
  },
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
  },
  country: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  zipcode: {
    type: Number,
    default: 0o00,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  receipts: {
    type: Array,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("contraseña")) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = bcrypt.hash(this.contraseña, salt);
});

export const User = mongoose.model("User", userSchema);
