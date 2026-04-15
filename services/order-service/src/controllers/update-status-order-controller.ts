import { Request, Response } from "express";
import { UpdateStatusOrderService } from "../services/update-status-order-service";

export class UpdateStatusOrderController {
  async handle(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;
    const { status } = request.body;

    const updateStatusOrderService = new UpdateStatusOrderService();

    const order = await updateStatusOrderService.execute({
      orderId: id,
      status,
    });

    return response.json(order)
  }
}
