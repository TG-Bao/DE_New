import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: { id: string; role: "USER" | "ADMIN" };
}

type JwtPayload = {
  id: string;
  role: "USER" | "ADMIN";
};

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
};

export const authorize = (roles: Array<"USER" | "ADMIN">) => (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Forbidden", 403));
  }

  return next();
};
