import { prisma } from "../database/prisma";
import { publishEvent } from "../messaging/publisher";

export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export class CreateProductService {
  async execute({
    name,
    price,
    imageUrl,
    category,
    stock,
  }: CreateProductRequest) {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        imageUrl,
        category,
      },
    });

    await publishEvent("product.created", {
      id: product.id,
      stock: Number(stock),
    });

    return product;
  }
}
