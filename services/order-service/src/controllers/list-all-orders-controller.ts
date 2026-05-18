import { Request, Response } from "express";
import { ListAllOrdersService } from "../services/list-all-orders-service";

export class ListAllOrdersController {
  async handle(request: Request, response: Response) {
    const { page = 1 } = request.query;

    const listAllOrdersService = new ListAllOrdersService();
    const result = await listAllOrdersService.execute({ page: Number(page) });

    return response.json(result);
  }
}
