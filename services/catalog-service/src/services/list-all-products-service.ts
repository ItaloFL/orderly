import { prisma } from "../database/prisma";

export class ListAllProductsService {
  async execute() {
    const products = await prisma.product.findMany();

    return products;
  }
}
