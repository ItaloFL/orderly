import { getRabbitChannel } from "./connection";
import { publishEvent } from "./publisher";
import { prisma } from "../database/prisma";

export async function startOrderConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("order-payment-queue", { durable: true });
  await channel.bindQueue(
    "order-payment-queue",
    "orderly.events",
    "payment.approved",
  );

  channel.prefetch(1);


  channel.consume("order-payment-queue", async (msg) => {
    if (!msg) return;

    try {
      const { data } = JSON.parse(msg.content.toString());
      const { orderId, success } = data;

      if (!success) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });

        channel.ack(msg);
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        console.error(`Pedido não encontrado: ${orderId}`);
        channel.nack(msg, false, false);
        return;
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });

      await publishEvent("stock.process", {
        orderId: order.id,
        userId: order.userId,
        transactionId: data.transactionId,
        amount: data.amount,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      await publishEvent("order.confirmed", {
        orderId: order.id,
        userId: order.userId,
        userEmail: order.userEmail,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        createdAt: order.createdAt,
      });

      channel.ack(msg);
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      channel.nack(msg, false, true);
    }
  });
}
