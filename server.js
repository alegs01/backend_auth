const express = require("express");
const cors = require("cors");
const swaggerDocs = require("./swaggerDocs");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db.js");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send(
    "El servidor está en funcionamiento. Puedes consultar la documentación de la API en /api-docs"
  );
});

swaggerDocs(app);

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
