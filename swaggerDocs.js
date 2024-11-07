const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Configuración de Swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de autenticación",
      version: "1.0.0",
      description: "Documentación de la API de autenticación",
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Servidor local",
      },
    ],
  },

  apis: [
    path.join(__dirname, "./routes/productRoutes.js"),
    path.join(__dirname, "./routes/userRoutes.js"),
  ],
});

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
