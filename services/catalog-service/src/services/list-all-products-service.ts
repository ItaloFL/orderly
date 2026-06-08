import { prisma } from "../database/prisma";
import axios from "axios";

export class ListAllProductsService {
  async execute() {
    const products = await prisma.product.findMany();

    if (products.length === 0) return [];

    const productIdsString = products.map((p) => p.id).join(",");

    try {
      const { data: stockMap } = await axios.get(
        `${process.env.STOCK_SERVICE_URL}/stock`,
        {
          params: { ids: productIdsString },
        },
      );

      return products.map((product) => ({
        ...product,
        stock: stockMap[product.id] ?? 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar estoques, retornando padrão 0:", error);

      return products.map((product) => ({
        ...product,
        stock: 0,
      }));
    }
  }
}
