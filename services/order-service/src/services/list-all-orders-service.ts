import { prisma } from "../database/prisma";

export class ListAllOrdersService {
  async execute() {
    const orders = await prisma.order.findMany();

    return orders;
  }
}
