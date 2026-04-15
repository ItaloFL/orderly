import express from "express";
import { routes } from "./routes/routes";
import cors from "cors";
import { getRabbitChannel } from "./messaging/connection";
import { startOrderConsumer } from "./messaging/consumer";

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

async function main() {
  await getRabbitChannel();
  await startOrderConsumer();

  app.listen(3002, () => console.log("Order Service rodando na porta 3002"));
}

main();
