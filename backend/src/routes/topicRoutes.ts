import { Router } from "express";
import { TopicController } from "../controllers/TopicController";
import { TopicService } from "../services/TopicService";
import { TopicRepository } from "../repositories/TopicRepository";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

const topicRepo = new TopicRepository();
const topicService = new TopicService(topicRepo);
const topicController = new TopicController(topicService);

router.get("/", authenticate, topicController.listPublished);
router.get("/all", authenticate, authorize(["ADMIN"]), topicController.listAll);
router.post("/", authenticate, authorize(["ADMIN"]), topicController.create);
router.patch("/:id", authenticate, authorize(["ADMIN"]), topicController.update);
router.delete("/:id", authenticate, authorize(["ADMIN"]), topicController.remove);

export default router;
