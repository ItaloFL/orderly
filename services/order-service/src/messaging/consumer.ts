import { prisma } from "../database/prisma";
import { getRabbitChannel } from "./connection";

export async function startOrderConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("order-update-queue", { durable: true });
  await channel.bindQueue(
    "order-update-queue",
    "orderly.events",
    "payment.approved",
  );
  await channel.bindQueue(
    "order-update-queue",
    "orderly.events",
    "payment.failed",
  );

  channel.consume("order-update-queue", async (msg) => {
    if (!msg) return;

    const { event, data } = JSON.parse(msg.content.toString());

    const status = event === "payment.approved" ? "CONFIRMED" : "CANCELLED";

    await prisma.order.update({
      where: { id: data.orderId },
      data: { status },
    });

    console.log(`Pedido ${data.orderId} atualizado para ${status}`);
    channel.ack(msg);
  });
}
