import { Request, Response } from "express";
import { ListAllOrdersService } from "../services/list-all-orders-service";

export class ListAllOrdersController {
  async handle(request: Request, response: Response) {
    const listAllOrdersService = new ListAllOrdersService();

    const orders = await listAllOrdersService.execute();

    return response.json(orders);
  }
}
