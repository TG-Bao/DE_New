import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { VocabularyDocument } from "../models/Vocabulary";

export class VocabularyService {
  constructor(private vocabRepo: VocabularyRepository) {}

  listByLesson(lessonId: string) {
    return this.vocabRepo.listByLesson(lessonId);
  }

  listByTopic(topic?: string) {
    return this.vocabRepo.listByTopic(topic);
  }

  create(data: Omit<VocabularyDocument, "_id">) {
    return this.vocabRepo.create(data);
  }

  update(id: string, data: Partial<VocabularyDocument>) {
    return this.vocabRepo.update(id, data);
  }

  remove(id: string) {
    return this.vocabRepo.remove(id);
  }
}
