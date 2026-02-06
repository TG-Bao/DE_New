import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("name, email, and password are required", 400);
    }

    const result = await this.authService.register(name, email, password);

    res.status(201).json({
      user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role },
      token: result.token
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("email and password are required", 400);
    }

    const result = await this.authService.login(email, password);

    res.json({
      user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role },
      token: result.token
    });
  });
}
