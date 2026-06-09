import Stripe from "stripe";
import { publishEvent } from "../messaging/publisher";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class WebhookService {
  async execute(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      throw new Error("Assinatura do webhook inválida");
    }

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
  }
}
