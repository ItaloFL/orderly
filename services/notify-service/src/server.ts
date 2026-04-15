import express from "express";
import { startPasswordResetConsumer } from "./consumers/password-reset-consumer";

const app = express();

app.get("/health", (_, res) => res.json({ status: "ok" }));

async function main() {
  await startPasswordResetConsumer();
  app.listen(3005, () => console.log("Notify Service rodando na porta 3003"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
