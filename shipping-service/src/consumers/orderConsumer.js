const { getChannel } =
require("../services/rabbitmq");

const Shipment =
require("../models/Shipment");

const { randomUUID } =
require("crypto");

console.log(Shipment);
async function consumeOrders() {

  const channel =
    getChannel();

  if (!channel) {

    console.log(
      "❌ RabbitMQ channel not found"
    );

    return;

  }

  const queue =
    "order.created";

  await channel.assertQueue(
    queue,
    {
      durable: true
    }
  );

  console.log(
    "📦 Waiting order events..."
  );

  channel.consume(
    queue,
    async (msg) => {

      try {

        const order =
          JSON.parse(
            msg.content.toString()
          );

        console.log(
          "📥 Order received:",
          order
        );

        const trackingNumber =
          "TRK-" +
          randomUUID()
            .substring(0, 8)
            .toUpperCase();

        

        const result =
          await Shipment.createShipment(
            order.order_id,
            order.customer_name,
            order.address,
            trackingNumber
          );

        console.log(
          "✅ Shipment Created:",
          trackingNumber
        );

        channel.ack(msg);

      } catch (error) {

        console.error(
          "❌ Consumer Error:"
        );

        console.error(error);

      }

    }
  );

}

module.exports =
consumeOrders;