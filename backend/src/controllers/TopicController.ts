import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export class TopicController {
  constructor(private topicService: TopicService) {}

  listPublished = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await this.topicService.listPublished();
    res.json(topics);
  });

  listAll = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await this.topicService.listAll();
    res.json(topics);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, order, level, isPublished } = req.body;
    if (!title || order === undefined || !level) {
      throw new AppError("title, order, level are required", 400);
    }

    const created = await this.topicService.create({
      title,
      description,
      order,
      level,
      isPublished: isPublished ?? true
    });
    res.status(201).json(created);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.topicService.update(req.params.id, req.body);
    if (!updated) {
      throw new AppError("Topic not found", 404);
    }
    res.json(updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.topicService.remove(req.params.id);
    res.status(204).send();
  });
}
