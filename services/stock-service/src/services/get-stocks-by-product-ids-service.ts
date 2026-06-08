import { prisma } from "../database/prisma";

export class GetStocksByProductIdsService {
  async execute(productIdsString: string) {
    const idsArray = productIdsString.split(",");

    const stockItems = await prisma.stockItem.findMany({
      where: {
        productId: {
          in: idsArray,
        },
      },
    });

    const stockMap = stockItems.reduce(
      (acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      },
      {} as Record<string, number>,
    );

    return stockMap;
  }
}
