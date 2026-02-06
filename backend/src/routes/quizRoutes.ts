import { Router } from "express";
import { QuizController } from "../controllers/QuizController";
import { QuizService } from "../services/QuizService";
import { QuizRepository } from "../repositories/QuizRepository";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { ProgressService } from "../services/ProgressService";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { QuestionService } from "../services/QuestionService";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { LessonRepository } from "../repositories/LessonRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { GrammarRepository } from "../repositories/GrammarRepository";

const router = Router();

const quizRepo = new QuizRepository();
const quizService = new QuizService(quizRepo);
const questionService = new QuestionService(new QuestionRepository());
const progressRepo = new ProgressRepository();
const progressService = new ProgressService(
  progressRepo,
  new LessonRepository(),
  new TopicRepository(),
  new VocabularyRepository(),
  new GrammarRepository(),
  quizRepo
);
const quizController = new QuizController(quizService, questionService, progressService);

router.get("/", authenticate, quizController.list);
router.get("/all", authenticate, authorize(["ADMIN"]), quizController.listAll);
router.get("/:id", authenticate, quizController.getDetail);
router.post("/", authenticate, authorize(["ADMIN"]), quizController.create);
router.patch("/:id", authenticate, authorize(["ADMIN"]), quizController.update);
router.delete("/:id", authenticate, authorize(["ADMIN"]), quizController.remove);
router.post("/submit", authenticate, quizController.submit);

export default router;
