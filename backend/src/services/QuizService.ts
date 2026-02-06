import { QuizRepository } from "../repositories/QuizRepository";
import { QuizDocument } from "../models/Quiz";

export class QuizService {
  constructor(private quizRepo: QuizRepository) {}

  listPublished() {
    return this.quizRepo.listPublished();
  }

  listAll() {
    return this.quizRepo.listAll();
  }

  listByScope(scopeType: string, scopeId?: string) {
    return this.quizRepo.listByScope(scopeType, scopeId);
  }

  getById(id: string) {
    return this.quizRepo.findById(id);
  }

  create(data: Omit<QuizDocument, "_id">) {
    return this.quizRepo.create(data);
  }

  update(id: string, data: Partial<QuizDocument>) {
    return this.quizRepo.update(id, data);
  }

  remove(id: string) {
    return this.quizRepo.remove(id);
  }

  grade(questions: { correctAnswer: string }[], answers: string[]) {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score += 1;
      }
    });

    return { score, total: questions.length };
  }
}
