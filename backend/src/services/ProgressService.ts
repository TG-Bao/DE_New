import { ObjectId } from "mongodb";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { LessonRepository } from "../repositories/LessonRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { GrammarRepository } from "../repositories/GrammarRepository";
import { QuizRepository } from "../repositories/QuizRepository";
import { LessonProgress, LessonStatus, ProgressDocument } from "../models/Progress";

export class ProgressService {
  constructor(
    private progressRepo: ProgressRepository,
    private lessonRepo: LessonRepository,
    private topicRepo: TopicRepository,
    private vocabRepo: VocabularyRepository,
    private grammarRepo: GrammarRepository,
    private quizRepo: QuizRepository
  ) {}

  getByUser(userId: string) {
    return this.progressRepo.getByUserId(userId);
  }

  private async ensureProgress(userId: string): Promise<ProgressDocument> {
    const current = await this.progressRepo.getByUserId(userId);
    if (current) return current;

    return this.progressRepo.upsert(userId, { lessonProgress: [], topicProgress: [], quizResults: [] });
  }

  private findLessonProgress(progress: ProgressDocument, lessonId: string): LessonProgress | undefined {
    return progress.lessonProgress.find(lp => lp.lessonId.toString() === lessonId);
  }

  private async ensureLessonProgress(userId: string, lessonId: string): Promise<ProgressDocument> {
    const progress = await this.ensureProgress(userId);
    const existing = this.findLessonProgress(progress, lessonId);

    if (!existing) {
      progress.lessonProgress.push({
        lessonId: new ObjectId(lessonId),
        status: "IN_PROGRESS",
        vocabLearned: [],
        grammarLearned: [],
        bestScore: 0,
        quizPassed: false
      });
    }

    return this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  async markVocabularyLearned(userId: string, lessonId: string, vocabId: string) {
    const progress = await this.ensureLessonProgress(userId, lessonId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return progress;

    if (!lessonProgress.vocabLearned.find(id => id.toString() === vocabId)) {
      lessonProgress.vocabLearned.push(new ObjectId(vocabId));
    }

    const updated = await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
    await this.evaluateLessonCompletion(userId, lessonId);
    return updated;
  }

  async markGrammarLearned(userId: string, lessonId: string, grammarId: string) {
    const progress = await this.ensureLessonProgress(userId, lessonId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return progress;

    if (!lessonProgress.grammarLearned.find(id => id.toString() === grammarId)) {
      lessonProgress.grammarLearned.push(new ObjectId(grammarId));
    }

    const updated = await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
    await this.evaluateLessonCompletion(userId, lessonId);
    return updated;
  }

  private async updateTopicProgress(userId: string, topicId: string) {
    const progress = await this.ensureProgress(userId);
    const lessons = await this.lessonRepo.listByTopic(topicId, false);
    const totalLessons = lessons.length;

    const completedLessons = lessons.filter(lesson => {
      const lp = progress.lessonProgress.find(p => p.lessonId.toString() === lesson._id!.toString());
      return lp?.status === "COMPLETED";
    }).length;

    let status: LessonStatus = "IN_PROGRESS";
    const anyStarted = progress.lessonProgress.some(p => {
      const lesson = lessons.find(l => l._id!.toString() === p.lessonId.toString());
      return lesson && p.status !== "LOCKED";
    });
    if (completedLessons === 0 && !anyStarted) status = "LOCKED";
    if (completedLessons === totalLessons && totalLessons > 0) status = "COMPLETED";

    const existing = progress.topicProgress.find(tp => tp.topicId.toString() === topicId);
    if (existing) {
      existing.completedLessons = completedLessons;
      existing.totalLessons = totalLessons;
      existing.status = status;
      existing.completedAt = status === "COMPLETED" ? new Date() : undefined;
    } else {
      progress.topicProgress.push({
        topicId: new ObjectId(topicId),
        completedLessons,
        totalLessons,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined
      });
    }

    return this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  private async unlockNextLesson(userId: string, currentLessonId: string) {
    const lesson = await this.lessonRepo.findById(currentLessonId);
    if (!lesson) return;

    const lessons = await this.lessonRepo.listByTopic(lesson.topicId.toString(), false);
    const index = lessons.findIndex(l => l._id!.toString() === currentLessonId);
    const next = lessons[index + 1];
    if (!next) return;

    const progress = await this.ensureProgress(userId);
    const nextProgress = this.findLessonProgress(progress, next._id!.toString());
    if (!nextProgress) {
      progress.lessonProgress.push({
        lessonId: next._id!,
        status: "IN_PROGRESS",
        vocabLearned: [],
        grammarLearned: [],
        bestScore: 0,
        quizPassed: false
      });
    } else if (nextProgress.status === "LOCKED") {
      nextProgress.status = "IN_PROGRESS";
    }

    await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  async completeLesson(userId: string, lessonId: string, scorePercent: number) {
    const progress = await this.ensureProgress(userId);
    let lessonProgress = this.findLessonProgress(progress, lessonId);

    if (!lessonProgress) {
      progress.lessonProgress.push({
        lessonId: new ObjectId(lessonId),
        status: "COMPLETED",
        vocabLearned: [],
        grammarLearned: [],
        bestScore: scorePercent,
        quizPassed: true,
        completedAt: new Date()
      });
      lessonProgress = this.findLessonProgress(progress, lessonId);
    } else {
      lessonProgress.status = "COMPLETED";
      lessonProgress.bestScore = Math.max(lessonProgress.bestScore, scorePercent);
      lessonProgress.quizPassed = true;
      lessonProgress.completedAt = new Date();
    }

    await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });

    await this.unlockNextLesson(userId, lessonId);

    const lesson = await this.lessonRepo.findById(lessonId);
    if (lesson) {
      await this.updateTopicProgress(userId, lesson.topicId.toString());
    }
  }

  async recordQuizResult(userId: string, quizId: string, score: number, total: number, percentage: number, passed: boolean) {
    const progress = await this.ensureProgress(userId);
    progress.quizResults.push({
      quizId: new ObjectId(quizId),
      score,
      total,
      percentage,
      passed,
      takenAt: new Date()
    });

    return this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  async recordLessonQuizScore(userId: string, lessonId: string, percentage: number, passed: boolean) {
    const progress = await this.ensureLessonProgress(userId, lessonId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return;

    lessonProgress.bestScore = Math.max(lessonProgress.bestScore, percentage);
    if (passed) {
      lessonProgress.quizPassed = true;
    }

    await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });

    await this.evaluateLessonCompletion(userId, lessonId);
  }

  private async evaluateLessonCompletion(userId: string, lessonId: string) {
    const progress = await this.ensureProgress(userId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return;

    const vocab = await this.vocabRepo.listByLesson(lessonId);
    const grammar = await this.grammarRepo.listByLesson(lessonId);
    const quizzes = await this.quizRepo.listByScope("LESSON", lessonId);
    const quizRequired = quizzes.length > 0;

    const vocabComplete = vocab.length === 0 || lessonProgress.vocabLearned.length >= vocab.length;
    const grammarComplete = grammar.length === 0 || lessonProgress.grammarLearned.length >= grammar.length;
    const quizComplete = !quizRequired || lessonProgress.quizPassed;

    if (vocabComplete && grammarComplete && quizComplete) {
      await this.completeLesson(userId, lessonId, lessonProgress.bestScore);
    }
  }
}
