import { prisma } from "../database/prisma";

const PER_PAGE = 8;

interface ListAllOrdersRequest {
  page: number;
}

export class ListAllOrdersService {
  async execute({ page }: ListAllOrdersRequest) {
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.order.count(),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        perPage: PER_PAGE,
        totalPages: Math.ceil(total / PER_PAGE),
      },
    };
  }
}
