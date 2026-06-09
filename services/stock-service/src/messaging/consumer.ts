import { getRabbitChannel } from "./connection";
import { publishEvent } from "./publisher";
import { prisma } from "../database/prisma";

export async function startConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("stock-product-created-queue", { durable: true });
  await channel.bindQueue(
    "stock-product-created-queue",
    "orderly.events",
    "product.created",
  );

  channel.prefetch(1);

  channel.consume("stock-product-created-queue", async (msg) => {
    if (!msg) return;

    try {
      const { data } = JSON.parse(msg.content.toString());

      await prisma.stockItem.upsert({
        where: { productId: data.id },
        update: {},
        create: {
          productId: data.id,
          quantity: data.stock,
        },
      });

      channel.ack(msg);
    } catch (err) {
      console.error("Erro ao criar estoque:", err);
      channel.nack(msg, false, false);
    }
  });

  await channel.assertQueue("stock-payment-queue", { durable: true });
  await channel.bindQueue(
    "stock-payment-queue",
    "orderly.events",
    "stock.process",
  );

  channel.consume("stock-payment-queue", async (msg) => {
    if (!msg) return;

    try {
      const { data } = JSON.parse(msg.content.toString());

      if (!data.items || !Array.isArray(data.items)) {
        console.error(`❌ Erro: items não encontrado no evento`, data);
        channel.ack(msg);
        return;
      }


      const updatePromises = data.items.map((item: any) =>
        prisma.stockItem.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        }),
      );

      await prisma.$transaction(updatePromises);

      await publishEvent("stock.updated", { orderId: data.orderId });

      channel.ack(msg);
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err);
      channel.nack(msg, false, true);
    }
  });
}
