import { Resend } from "resend";
import { orderConfirmationTemplate } from "../templates/order-confirmation-template";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  items: OrderItem[],
  total: number,
  createdAt: string,
) {
  const html = orderConfirmationTemplate(orderId, items, total, createdAt);

  await resend.emails.send({
    from: "Orderly <no-reply@italofldev.com>",
    to: email,
    subject: `Compra Confirmada - Pedido #${orderId}`,
    html,
  });
}
