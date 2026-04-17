import { prisma } from "../database/prisma";
import { AppError } from "../errors/AppError/AppError";

type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface UpdateStatusOrderServiceRequest {
  orderId: string;
  status: OrderStatus;
}

export class UpdateStatusOrderService {
  async execute({ orderId, status }: UpdateStatusOrderServiceRequest) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new AppError("Pedido nao encontrado");

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return updatedOrder;
  }
}
