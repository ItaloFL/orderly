import express from "express";
import { routes } from "./routes/routes";
import cors from "cors";
import { getRabbitChannel } from "./messaging/connection";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

async function main() {
  await getRabbitChannel();
  app.listen(3001, () => console.log("Auth Service rodando na porta 3001"));
}

main();
