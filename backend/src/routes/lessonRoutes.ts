import { Router } from "express";
import { LessonController } from "../controllers/LessonController";
import { LessonService } from "../services/LessonService";
import { LessonRepository } from "../repositories/LessonRepository";
import { VocabularyService } from "../services/VocabularyService";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { GrammarService } from "../services/GrammarService";
import { GrammarRepository } from "../repositories/GrammarRepository";
import { QuizService } from "../services/QuizService";
import { QuizRepository } from "../repositories/QuizRepository";
import { QuestionService } from "../services/QuestionService";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { ProgressService } from "../services/ProgressService";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

const lessonRepo = new LessonRepository();
const lessonService = new LessonService(lessonRepo);
const vocabRepo = new VocabularyRepository();
const grammarRepo = new GrammarRepository();
const quizRepo = new QuizRepository();
const vocabService = new VocabularyService(vocabRepo);
const grammarService = new GrammarService(grammarRepo);
const quizService = new QuizService(quizRepo);
const questionService = new QuestionService(new QuestionRepository());
const progressService = new ProgressService(
  new ProgressRepository(),
  lessonRepo,
  new TopicRepository(),
  vocabRepo,
  grammarRepo,
  quizRepo
);

const lessonController = new LessonController(
  lessonService,
  vocabService,
  grammarService,
  quizService,
  questionService,
  progressService
);

router.get("/topic/:topicId", authenticate, lessonController.listByTopic);
router.get("/:id", authenticate, lessonController.getDetail);
router.post("/", authenticate, authorize(["ADMIN"]), lessonController.create);
router.patch("/:id", authenticate, authorize(["ADMIN"]), lessonController.update);
router.delete("/:id", authenticate, authorize(["ADMIN"]), lessonController.remove);

export default router;
