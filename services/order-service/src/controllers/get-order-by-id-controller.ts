import { Request, Response } from "express";
import { GetOrderByIdService } from "../services/get-order-by-id-service";

export class GetOrderByIdController {
  async handle(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;

    const getOrderByIdServce = new GetOrderByIdService();

    const order = await getOrderByIdServce.execute({
      id,
    });

    return response.json(order);
  }
}
