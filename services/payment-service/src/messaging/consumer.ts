import { getRabbitChannel } from "./connection"; // ajuste o caminho se necessário
import { publishEvent } from "../messaging/publisher";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function startConsumer() {
  const channel = await getRabbitChannel();

  // ── Consumer: Processa Webhook do Stripe de forma assíncrona
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

      // Validação dos dados necessários vindos da fila
      if (!data.rawBody || !data.signature) {
        console.error(
          "❌ Erro: rawBody ou signature não encontrados na mensagem",
        );
        channel.ack(msg); // Remove da fila pois a mensagem está malformada
        return;
      }

      console.log("💳 Processando webhook do Stripe vindo da fila...");

      // Reconstroi o Buffer do body enviado pela rota HTTP
      const rawBodyBuffer = Buffer.from(data.rawBody);

      // Valida a assinatura de segurança do Stripe
      const event = stripe.webhooks.constructEvent(
        rawBodyBuffer,
        data.signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      // Se o evento for de checkout concluído, processa o pagamento
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const { orderId } = session.metadata!;
        const success = session.payment_status === "paid";

        // Publica o evento que os outros microsserviços (como o de estoque) estão esperando
        await publishEvent("payment.approved", {
          orderId,
          success,
          transactionId: session.payment_intent as string,
          amount: (session.amount_total ?? 0) / 100,
        });

        console.log(
          `✅ Webhook Processado: pagamento ${success ? "aprovado" : "recusado"} para o pedido ${orderId}`,
        );
      }

      // Confirma o processamento com sucesso
      channel.ack(msg);
    } catch (err) {
      console.error("❌ Erro ao processar webhook do Stripe:", err);

      // Se a assinatura for inválida ou o JSON falhar, não adianta recolocar na fila (false, false)
      // Evita loops infinitos de erro caso o Stripe envie algo corrompido
      channel.nack(msg, false, false);
    }
  });
}
