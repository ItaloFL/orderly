import { Request, Response } from "express";
import { CreateCheckoutService } from "../services/create-checkout-service";

export class CreateCheckoutController {
  async handle(request: Request, response: Response) {
    const { id: orderId } = request.params as { id: string };
    const { userId, total } = request.body;

    const createCheckoutService = new CreateCheckoutService();

    const result = await createCheckoutService.execute({
      orderId,
      userId,
      total,
    });

    return response.json(result);
  }
}
