import { GrammarRepository } from "../repositories/GrammarRepository";
import { GrammarDocument } from "../models/Grammar";

export class GrammarService {
  constructor(private grammarRepo: GrammarRepository) {}

  listByLesson(lessonId: string) {
    return this.grammarRepo.listByLesson(lessonId);
  }

  create(data: Omit<GrammarDocument, "_id">) {
    return this.grammarRepo.create(data);
  }

  update(id: string, data: Partial<GrammarDocument>) {
    return this.grammarRepo.update(id, data);
  }

  remove(id: string) {
    return this.grammarRepo.remove(id);
  }
}
