import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { VocabularyService } from "../services/VocabularyService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export class VocabularyController {
  constructor(private vocabService: VocabularyService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const topic = req.query.topic?.toString();
    const lessonId = req.query.lessonId?.toString();
    const items = lessonId ? await this.vocabService.listByLesson(lessonId) : await this.vocabService.listByTopic(topic);
    res.json(items);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId, word, meaning, example, topic, level, phonetic, audioUrl } = req.body;
    if (!lessonId || !word || !meaning || !example || !topic || !level) {
      throw new AppError("lessonId, word, meaning, example, topic, level are required", 400);
    }

    const created = await this.vocabService.create({
      lessonId: new ObjectId(lessonId),
      word,
      meaning,
      example,
      topic,
      level,
      phonetic,
      audioUrl
    });
    res.status(201).json(created);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const data = { ...req.body };
    if (data.lessonId) data.lessonId = new ObjectId(data.lessonId);
    
    const updated = await this.vocabService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Vocabulary not found", 404);
    }
    res.json(updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.vocabService.remove(req.params.id);
    res.status(204).send();
  });
}
