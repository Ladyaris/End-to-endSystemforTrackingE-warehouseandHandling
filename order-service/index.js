require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'API untuk mengelola pesanan',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Order Service' }],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ service: 'Order Service', status: 'running', port: 3001 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});