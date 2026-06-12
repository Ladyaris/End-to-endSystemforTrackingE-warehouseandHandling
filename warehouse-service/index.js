require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Swagger Config ─────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Warehouse Service API',
      version: '1.0.0',
      description: 'API untuk manajemen stok barang.',
    },
    servers: [{ url: 'http://localhost:3002', description: 'Warehouse Service' }],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ─── Routes ──────────────────────────────────────────────────────────────────
const warehouseRoutes = require('./routes/warehouses');
app.use("/warehouses", warehouseRoutes);

app.get('/', (req, res) => {
  res.json({ service: 'Warehouse Service', status: 'running', port: 3002 });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Warehouse Service running on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
