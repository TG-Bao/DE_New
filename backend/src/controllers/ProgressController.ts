import { Response } from "express";
import { ProgressService } from "../services/ProgressService";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";

export class ProgressController {
  constructor(private progressService: ProgressService) {}

  getMyProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const progress = await this.progressService.getByUser(req.user.id);
    res.json(
      progress || {
        lessonProgress: [],
        topicProgress: [],
        quizResults: []
      }
    );
  });

  markVocabularyLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { lessonId, vocabId } = req.body as { lessonId: string; vocabId: string };
    if (!lessonId || !vocabId) {
      throw new AppError("lessonId and vocabId are required", 400);
    }

    const progress = await this.progressService.markVocabularyLearned(req.user.id, lessonId, vocabId);
    res.json(progress);
  });

  markGrammarLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { lessonId, grammarId } = req.body as { lessonId: string; grammarId: string };
    if (!lessonId || !grammarId) {
      throw new AppError("lessonId and grammarId are required", 400);
    }

    const progress = await this.progressService.markGrammarLearned(req.user.id, lessonId, grammarId);
    res.json(progress);
  });
}
