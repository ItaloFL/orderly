import express, { NextFunction, Request, Response } from "express";
import { startPasswordResetConsumer } from "./consumers/password-reset-consumer";
import { AppError } from "./errors/AppError/AppError";

const app = express();

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.code).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      message: `Server Error, ${err.message}`,
    });
  },
);

async function main() {
  await startPasswordResetConsumer();
  app.listen(3005, () => console.log("Notify Service rodando na porta 3003"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
