import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export async function ensureAuthenticateMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    request.userId = decoded.userId; 
    next();
  } catch {
    return response.status(401).json({ message: "Token inválido" });
  }
}
