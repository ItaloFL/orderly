import { getRabbitChannel } from "./connection";
import { publishEvent } from "../messaging/publisher";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function startConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("payment-stripe-webhook-queue", { durable: true });
  await channel.bindQueue(
    "payment-stripe-webhook-queue",
    "orderly.events",
    "payment.stripe-webhook",
  );

  channel.prefetch(1);

  channel.consume("payment-stripe-webhook-queue", async (msg) => {
    if (!msg) return;

    try {
      const { data } = JSON.parse(msg.content.toString());

      if (!data.rawBody || !data.signature) {
        console.error(
          "❌ Erro: rawBody ou signature não encontrados na mensagem",
        );
        channel.ack(msg);
        return;
      }

      const rawBodyBuffer = Buffer.from(data.rawBody);

      const event = stripe.webhooks.constructEvent(
        rawBodyBuffer,
        data.signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const { orderId } = session.metadata!;
        const success = session.payment_status === "paid";

        await publishEvent("payment.approved", {
          orderId,
          success,
          transactionId: session.payment_intent as string,
          amount: (session.amount_total ?? 0) / 100,
        });

       
      }

      channel.ack(msg);
    } catch (err) {
      console.error("❌ Erro ao processar webhook do Stripe:", err);

      channel.nack(msg, false, false);
    }
  });
}
