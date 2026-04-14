import { Request, Response } from "express";
import { CreateOrderService } from "../services/create-order-service";

export class CreateOrderController {
  async handle(request: Request, response: Response) {
    const { items } = request.body;
    const userId = request.userId;

    const createOrderService = new CreateOrderService();
    const order = await createOrderService.execute({ userId, items });

    return response.status(201).json(order);
  }
}
