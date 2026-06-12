require("dotenv").config();

const app =
require("./app");

const {
  connectRabbitMQ
} = require("./services/rabbitmq");

const consumeOrders =
require("./consumers/orderConsumer");

const pool =
require("./config/db");

app.listen(
  process.env.PORT,
  async () => {

    console.log(
      `🚀 Server running on port ${process.env.PORT}`
    );

    try {

      const result =
        await pool.query(
          "SELECT * FROM shipments"
        );

      console.log(
        "✅ DB TEST:",
        result.rows.length,
        "shipments found"
      );

    } catch(error) {

      console.error(
        "❌ DB TEST ERROR:",
        error
      );

    }

    await connectRabbitMQ();

    await consumeOrders();

  }
);