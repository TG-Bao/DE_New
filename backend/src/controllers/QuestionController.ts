import { Response } from "express";
import { ObjectId } from "mongodb";
import { QuestionService } from "../services/QuestionService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";

export class QuestionController {
  constructor(private questionService: QuestionService) {}

  listByQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { quizId } = req.params;
    const items = await this.questionService.listByQuiz(quizId);
    res.json(items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { quizId, sourceType, sourceId, question, options, correctAnswer, type } = req.body;
    if (!quizId || !sourceType || !question || !options || !correctAnswer) {
      throw new AppError("quizId, sourceType, question, options, correctAnswer are required", 400);
    }

    const created = await this.questionService.create({
      quizId: new ObjectId(quizId),
      sourceType,
      sourceId: sourceId ? new ObjectId(sourceId) : undefined,
      question,
      options,
      correctAnswer,
      type: type || "MCQ"
    });

    res.status(201).json(created);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body };
    if (data.quizId) data.quizId = new ObjectId(data.quizId);
    if (data.sourceId) data.sourceId = new ObjectId(data.sourceId);
    
    const updated = await this.questionService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Question not found", 404);
    }
    res.json(updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.questionService.remove(req.params.id);
    res.status(204).send();
  });
}
