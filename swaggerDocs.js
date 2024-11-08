const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Configuración de Swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Productos",
      version: "1.0.0",
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
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
