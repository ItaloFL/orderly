import express from "express";
import { routes } from "./routes/route";
import { startConsumer } from "./messaging/consumer";

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3004, async () => {
  console.log("Stock server is running on port 3004");

  try {
    await startConsumer();
    console.log("🐰 RabbitMQ Consumers iniciados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao iniciar consumers do RabbitMQ:", error);
  }
});
