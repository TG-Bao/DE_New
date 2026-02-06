import { QuestionRepository } from "../repositories/QuestionRepository";
import { QuestionDocument } from "../models/Question";

export class QuestionService {
  constructor(private questionRepo: QuestionRepository) {}

  listByQuiz(quizId: string) {
    return this.questionRepo.listByQuiz(quizId);
  }

  create(data: Omit<QuestionDocument, "_id">) {
    return this.questionRepo.create(data);
  }

  update(id: string, data: Partial<QuestionDocument>) {
    return this.questionRepo.update(id, data);
  }

  remove(id: string) {
    return this.questionRepo.remove(id);
  }
}
