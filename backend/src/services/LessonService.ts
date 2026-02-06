import { LessonRepository } from "../repositories/LessonRepository";
import { LessonDocument } from "../models/Lesson";

export class LessonService {
  constructor(private lessonRepo: LessonRepository) {}

  listByTopic(topicId: string, publishedOnly = true) {
    return this.lessonRepo.listByTopic(topicId, publishedOnly);
  }

  getById(id: string) {
    return this.lessonRepo.findById(id);
  }

  create(data: Omit<LessonDocument, "_id">) {
    return this.lessonRepo.create(data);
  }

  update(id: string, data: Partial<LessonDocument>) {
    return this.lessonRepo.update(id, data);
  }

  remove(id: string) {
    return this.lessonRepo.remove(id);
  }
}
