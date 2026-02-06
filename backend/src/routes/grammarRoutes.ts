import { Router } from "express";
import { GrammarController } from "../controllers/GrammarController";
import { GrammarService } from "../services/GrammarService";
import { GrammarRepository } from "../repositories/GrammarRepository";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

const grammarService = new GrammarService(new GrammarRepository());
const grammarController = new GrammarController(grammarService);

router.get("/lesson/:lessonId", authenticate, grammarController.listByLesson);
router.post("/", authenticate, authorize(["ADMIN"]), grammarController.create);
router.patch("/:id", authenticate, authorize(["ADMIN"]), grammarController.update);
router.delete("/:id", authenticate, authorize(["ADMIN"]), grammarController.remove);

export default router;
