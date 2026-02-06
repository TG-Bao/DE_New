import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { QuestionService } from "../services/QuestionService";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

const questionService = new QuestionService(new QuestionRepository());
const questionController = new QuestionController(questionService);

router.get("/quiz/:quizId", authenticate, questionController.listByQuiz);
router.post("/", authenticate, authorize(["ADMIN"]), questionController.create);
router.patch("/:id", authenticate, authorize(["ADMIN"]), questionController.update);
router.delete("/:id", authenticate, authorize(["ADMIN"]), questionController.remove);

export default router;
