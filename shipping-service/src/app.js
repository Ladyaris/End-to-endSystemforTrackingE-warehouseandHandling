const express =
require("express");

const cors =
require("cors");

const swaggerUi =
require("swagger-ui-express");

const swaggerSpec =
require("./swagger/swagger");

const shipmentRoutes =
require("./routes/shipmentRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/shipments",
  shipmentRoutes
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req,res)=>{
  res.send(
    "Shipping Service Running"
  );
});

module.exports = app;