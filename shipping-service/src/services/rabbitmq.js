const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL
    );

    channel =
      await connection.createChannel();

    console.log(
      "🐰 RabbitMQ Connected"
    );

    return channel;

  } catch (error) {

    console.error(
      "RabbitMQ Error:",
      error.message
    );

  }
}

function getChannel() {
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel
};