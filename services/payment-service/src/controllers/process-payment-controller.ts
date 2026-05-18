import { Request, Response } from "express";
import { ProcessPaymentService } from "../services/process-payment-service";

export class ProcessPaymentController {
  async handle(request: Request, response: Response) {
    const { orderId, userId, total } = request.body;

    const processPaymentService = new ProcessPaymentService();
    const result = await processPaymentService.execute({
      orderId,
      userId,
      total,
    });

    return response.json(result);
  }
}
