import { Response } from "express";
import { ObjectId } from "mongodb";
import { GrammarService } from "../services/GrammarService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";

export class GrammarController {
  constructor(private grammarService: GrammarService) {}

  listByLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lessonId } = req.params;
    const items = await this.grammarService.listByLesson(lessonId);
    res.json(items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lessonId, title, description, examples } = req.body;
    if (!lessonId || !title || !description) {
      throw new AppError("lessonId, title, description are required", 400);
    }

    const created = await this.grammarService.create({
      lessonId: new ObjectId(lessonId),
      title,
      description,
      examples: examples || []
    });

    res.status(201).json(created);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body };
    if (data.lessonId) data.lessonId = new ObjectId(data.lessonId);
    
    const updated = await this.grammarService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Grammar not found", 404);
    }
    res.json(updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.grammarService.remove(req.params.id);
    res.status(204).send();
  });
}
