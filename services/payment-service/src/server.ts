import express from "express";
import { startConsumer } from "./messaging/consumer";
import { ProcessPaymentController } from "./controllers/process-payment-controller";
import { WebhookController } from "./controllers/webhook-controller";

const app = express();
const PORT = process.env.PORT || 3003;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  new WebhookController().handle,
);

app.use(express.json());

app.post("/payments", new ProcessPaymentController().handle);

async function main() {
  await startConsumer();
  app.listen(PORT, () => {
    console.log(`Payment Service rodando na porta ${PORT}`);
  });
}

main();
