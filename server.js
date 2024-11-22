const express = require("express");
const cors = require("cors");
const swaggerDocs = require("./swaggerDocs");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes.js");
const connectDB = require("./config/db.js");

require("dotenv").config();
const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use((req, res, next) => {
  if (req.originalUrl === "/api/checkout/create-order") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/api/checkout", checkoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send(
    "El servidor está en funcionamiento. Puedes consultar la documentación de la API en /api-docs"
  );
});

swaggerDocs(app);

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
