const swaggerJsDoc =
require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:
        "Shipping Service API",
      version: "1.0.0",
      description:
        "Shipping & Tracking Service"
    }
  },
  apis: [
    "./src/routes/*.js"
  ]
};

module.exports =
swaggerJsDoc(options);