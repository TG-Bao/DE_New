import { Router } from "express";
import { VocabularyController } from "../controllers/VocabularyController";
import { VocabularyService } from "../services/VocabularyService";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

const vocabRepo = new VocabularyRepository();
const vocabService = new VocabularyService(vocabRepo);
const vocabController = new VocabularyController(vocabService);

router.get("/", authenticate, vocabController.list);
router.post("/", authenticate, authorize(["ADMIN"]), vocabController.create);
router.patch("/:id", authenticate, authorize(["ADMIN"]), vocabController.update);
router.delete("/:id", authenticate, authorize(["ADMIN"]), vocabController.remove);

export default router;
