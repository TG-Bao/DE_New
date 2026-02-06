import { Response } from "express";
import { ObjectId } from "mongodb";
import { LessonService } from "../services/LessonService";
import { VocabularyService } from "../services/VocabularyService";
import { GrammarService } from "../services/GrammarService";
import { QuizService } from "../services/QuizService";
import { QuestionService } from "../services/QuestionService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { ProgressService } from "../services/ProgressService";

export class LessonController {
  constructor(
    private lessonService: LessonService,
    private vocabService: VocabularyService,
    private grammarService: GrammarService,
    private quizService: QuizService,
    private questionService: QuestionService,
    private progressService: ProgressService
  ) {}

  listByTopic = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { topicId } = req.params;
    const lessons = await this.lessonService.listByTopic(topicId, true);

    const progress = req.user ? await this.progressService.getByUser(req.user.id) : null;
    const completedLessonIds = new Set(
      progress?.lessonProgress.filter(p => p.status === "COMPLETED").map(p => p.lessonId.toString()) || []
    );

    const items = lessons.map((lesson, index) => {
      const lp = progress?.lessonProgress.find(p => p.lessonId.toString() === lesson._id!.toString());
      const prevLesson = lessons[index - 1];
      const prevCompleted = !prevLesson || completedLessonIds.has(prevLesson._id!.toString());
      const unlocked = index === 0 || prevCompleted || lp?.status === "IN_PROGRESS" || lp?.status === "COMPLETED";
      const status = lp?.status === "COMPLETED" ? "COMPLETED" : unlocked ? "IN_PROGRESS" : "LOCKED";
      return {
        ...lesson,
        status,
        canAccess: status !== "LOCKED"
      };
    });

    res.json(items);
  });

  getDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lesson = await this.lessonService.getById(req.params.id);
    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    const [vocabulary, grammar, quizzes, progress] = await Promise.all([
      this.vocabService.listByLesson(lesson._id!.toString()),
      this.grammarService.listByLesson(lesson._id!.toString()),
      this.quizService.listByScope("LESSON", lesson._id!.toString()),
      req.user ? this.progressService.getByUser(req.user.id) : Promise.resolve(null)
    ]);

    const quiz = quizzes[0];
    const questions = quiz ? await this.questionService.listByQuiz(quiz._id!.toString()) : [];

    const lessonProgress = progress?.lessonProgress.find(p => p.lessonId.toString() === lesson._id!.toString());
    const vocabLearned = lessonProgress?.vocabLearned.length || 0;
    const grammarLearned = lessonProgress?.grammarLearned.length || 0;
    const vocabTotal = vocabulary.length;
    const grammarTotal = grammar.length;
    const quizPassed = lessonProgress?.quizPassed || false;
    const components = [vocabTotal > 0, grammarTotal > 0, !!quiz].filter(Boolean).length || 1;
    const completedParts = [
      vocabTotal === 0 || vocabLearned >= vocabTotal,
      grammarTotal === 0 || grammarLearned >= grammarTotal,
      !quiz || quizPassed
    ].filter(Boolean).length;
    const completionPercent = Math.round((completedParts / components) * 100);

    res.json({
      lesson,
      vocabulary,
      grammar,
      quiz,
      questions,
      overview: {
        vocabLearned,
        vocabTotal,
        grammarLearned,
        grammarTotal,
        quizPassed,
        completionPercent,
        status: lessonProgress?.status || "IN_PROGRESS"
      }
    });
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { topicId, title, description, order, isPublished } = req.body;
    if (!topicId || !title || order === undefined) {
      throw new AppError("topicId, title, order are required", 400);
    }

    const created = await this.lessonService.create({
      topicId: new ObjectId(topicId),
      title,
      description,
      order,
      isPublished: isPublished ?? true
    });
    res.status(201).json(created);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body };
    if (data.topicId) data.topicId = new ObjectId(data.topicId);
    
    const updated = await this.lessonService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Lesson not found", 404);
    }
    res.json(updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.lessonService.remove(req.params.id);
    res.status(204).send();
  });
}
