import { ObjectId } from "mongodb";

export type LessonStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

export interface QuizResult {
  quizId: ObjectId;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  takenAt: Date;
}

export interface LessonProgress {
  lessonId: ObjectId;
  status: LessonStatus;
  vocabLearned: ObjectId[];
  grammarLearned: ObjectId[];
  bestScore: number;
  quizPassed: boolean;
  completedAt?: Date;
}

export interface TopicProgress {
  topicId: ObjectId;
  completedLessons: number;
  totalLessons: number;
  status: LessonStatus;
  completedAt?: Date;
}

export interface ProgressDocument {
  _id?: ObjectId;
  userId: ObjectId;
  lessonProgress: LessonProgress[];
  topicProgress: TopicProgress[];
  quizResults: QuizResult[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const PROGRESS_COLLECTION = "progress";
