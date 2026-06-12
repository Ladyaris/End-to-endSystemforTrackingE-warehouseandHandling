const amqp = require("amqplib");

async function sendOrder() {

  const connection =
    await amqp.connect(
      "amqp://guest:guest@localhost"
    );

  const channel =
    await connection.createChannel();

  const queue =
    "order.created";

  await channel.assertQueue(
    queue,
    {
      durable: true
    }
  );

  const order = {
    order_id: 5001,
    customer_name: "Wina",
    address: "Bandung"
  };

  channel.sendToQueue(
    queue,
    Buffer.from(
      JSON.stringify(order)
    )
  );

  console.log(
    "📤 Order Sent"
  );

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendOrder();
