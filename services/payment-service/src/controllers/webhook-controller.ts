import { Request, Response } from "express";
import { WebhookService } from "../services/webhook-service";

export class WebhookController {
  async handle(request: Request, response: Response) {
    const signature = request.headers["stripe-signature"] as string;

    const webhookService = new WebhookService();
    await webhookService.execute(request.body as Buffer, signature);

    return response.json({ received: true });
  }
}