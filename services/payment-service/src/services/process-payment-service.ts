import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PaymentData {
  orderId: string;
  userId: string;
  total: number;
}

export class ProcessPaymentService {
  async execute({ orderId, userId, total }: PaymentData) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Pedido #${orderId}`,
              description: "Orderly — pagamento seguro",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId, userId },
      success_url: `${process.env.FRONTEND_URL}/orders/${orderId}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?payment=cancelled`,
    });

    return {
      checkoutUrl: session.url!,
      sessionId: session.id,
    };
  }
}
