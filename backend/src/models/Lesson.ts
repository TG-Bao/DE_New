import { ObjectId } from "mongodb";

export interface LessonDocument {
  _id?: ObjectId;
  topicId: ObjectId;
  title: string;
  description?: string;
  order: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LESSON_COLLECTION = "lessons";
