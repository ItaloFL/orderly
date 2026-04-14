import { prisma } from "../database/prisma";

interface GetOrderByIdServiceRequest {
  id: string;
}

export class GetOrderByIdService {
  async execute({ id }: GetOrderByIdServiceRequest) {
    const order = await prisma.order.findFirst({
      where: {
        id,
      },
    });

    return order;
  }
}
