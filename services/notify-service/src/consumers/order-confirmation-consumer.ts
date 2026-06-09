import { getRabbitChannel } from "../messaging/connection";
import { sendOrderConfirmationEmail } from "../services/send-order-confirmation-email-service";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationData {
  orderId: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export async function startOrderConfirmationConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("notify-order-confirmed-queue", { durable: true });
  await channel.bindQueue(
    "notify-order-confirmed-queue",
    "orderly.events",
    "order.confirmed",
  );

  channel.prefetch(1);

  channel.consume("notify-order-confirmed-queue", async (msg) => {
    if (!msg) return;

    let data: OrderConfirmationData;

    try {
      data = JSON.parse(msg.content.toString()).data;
    } catch (err) {
      console.error("Erro ao parsear mensagem:", err);
      channel.nack(msg, false, false);
      return;
    }

    try {
      await sendOrderConfirmationEmail(
        data.userEmail,
        data.orderId,
        data.items,
        data.total,
        data.createdAt,
      );

      channel.ack(msg);
    } catch (err) {
      console.error("Erro ao enviar email de confirmação:", err);
      channel.nack(msg, false, true);
    }
  });
}
