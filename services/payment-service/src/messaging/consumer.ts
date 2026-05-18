import { getRabbitChannel } from "./connection";

export async function startConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("payment-order-created", { durable: true });
  await channel.bindQueue(
    "payment-order-created",
    "orderly.events",
    "order.created",
  );

  channel.prefetch(1);

  channel.consume("payment-order-created", async (msg) => {
    if (!msg) return;
    const { data } = JSON.parse(msg.content.toString());
    console.log(
      `📦 Pedido recebido, aguardando checkout Stripe: ${data.orderId}`,
    );
    channel.ack(msg);
  });
}
