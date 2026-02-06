import { Response } from "express";
import { ObjectId } from "mongodb";
import { QuizService } from "../services/QuizService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { ProgressService } from "../services/ProgressService";
import { QuestionService } from "../services/QuestionService";

export class QuizController {
  constructor(
    private quizService: QuizService,
    private questionService: QuestionService,
    private progressService: ProgressService
  ) {}

  list = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const items = await this.quizService.listPublished();
    res.json(items);
  });

  listAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const items = await this.quizService.listAll();
    res.json(items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { scopeType, scopeId, title, passScore, isPublished } = req.body;
    if (!scopeType || !title) {
      throw new AppError("scopeType, title are required", 400);
    }

    const created = await this.quizService.create({
      scopeType,
      scopeId: scopeId ? new ObjectId(scopeId) : undefined,
      title,
      passScore: passScore ?? 70,
      isPublished: isPublished ?? true
    });
    res.status(201).json(created);
  });

  submit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { quizId, answers } = req.body as { quizId: string; answers: Record<string, string> };

    if (!quizId || !answers) {
      throw new AppError("quizId and answers are required", 400);
    }

    const quiz = await this.quizService.getById(quizId);
    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    const questions = await this.questionService.listByQuiz(quizId);
    if (questions.length === 0) {
      throw new AppError("Quiz has no questions", 400);
    }

    const answersList = questions.map(q => answers[q._id!.toString()] || "");
    const result = this.quizService.grade(questions, answersList);
    const percentage = Math.round((result.score / result.total) * 100);
    const passed = percentage >= quiz.passScore;

    if (req.user) {
      await this.progressService.recordQuizResult(
        req.user.id,
        quizId,
        result.score,
        result.total,
        percentage,
        passed
      );

      if (quiz.scopeType === "LESSON" && quiz.scopeId) {
        await this.progressService.recordLessonQuizScore(req.user.id, quiz.scopeId.toString(), percentage, passed);
      }
    }

    res.json({ ...result, percentage, passed, passScore: quiz.passScore });
  });

  getDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const quiz = await this.quizService.getById(req.params.id);
    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    const questions = await this.questionService.listByQuiz(quiz._id!.toString());
    res.json({ quiz, questions });
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body };
    if (data.scopeId) data.scopeId = new ObjectId(data.scopeId);
    
    const updated = await this.quizService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Quiz not found", 404);
    }
    res.json(updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.quizService.remove(req.params.id);
    res.status(204).send();
  });
}
