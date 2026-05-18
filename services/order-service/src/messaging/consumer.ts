import { prisma } from "../database/prisma";
import { getRabbitChannel } from "./connection";

export async function startOrderConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("order-update-queue", { durable: true });
  await channel.bindQueue(
    "order-update-queue",
    "orderly.events",
    "payment.processed",
  );

  channel.consume("order-update-queue", async (msg) => {
    if (!msg) return;

    const { data } = JSON.parse(msg.content.toString());

    const status = data.success ? "CONFIRMED" : "CANCELLED";

    await prisma.order.update({
      where: { id: data.orderId },
      data: { status },
    });

    console.log(`Pedido ${data.orderId} atualizado para ${status}`);
    channel.ack(msg);
  });
}
