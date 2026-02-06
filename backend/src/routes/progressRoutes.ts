import { Router } from "express";
import { ProgressController } from "../controllers/ProgressController";
import { ProgressService } from "../services/ProgressService";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { LessonRepository } from "../repositories/LessonRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { GrammarRepository } from "../repositories/GrammarRepository";
import { QuizRepository } from "../repositories/QuizRepository";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

const progressRepo = new ProgressRepository();
const progressService = new ProgressService(
  progressRepo,
  new LessonRepository(),
  new TopicRepository(),
  new VocabularyRepository(),
  new GrammarRepository(),
  new QuizRepository()
);
const progressController = new ProgressController(progressService);

router.get("/me", authenticate, progressController.getMyProgress);
router.post("/vocabulary", authenticate, progressController.markVocabularyLearned);
router.post("/grammar", authenticate, progressController.markGrammarLearned);

export default router;
