import express, { NextFunction, Request, Response } from "express";
import { routes } from "./routes/routes";
import cors from "cors";
import { getRabbitChannel } from "./messaging/connection";
import { AppError } from "./errors/AppError/AppError";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

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
  await getRabbitChannel();
  app.listen(3001, () => console.log("Auth Service rodando na porta 3001"));
}

main();
