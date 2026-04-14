import { prisma } from "../database/prisma";
import { publishEvent } from "../messaging/publisher";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderDTO {
  userId: string;
  items: OrderItem[];
}

export class CreateOrderService {
  async execute({ userId, items }: CreateOrderDTO) {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    await publishEvent("order.created", {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      items: order.items,
    });

    return order;
  }
}
