import { ObjectId } from "mongodb";

export type QuizScopeType = "LESSON" | "TOPIC" | "LEVEL";

export interface QuizDocument {
  _id?: ObjectId;
  scopeType: QuizScopeType;
  scopeId?: ObjectId;
  title: string;
  passScore: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const QUIZ_COLLECTION = "quizzes";
