import { ObjectId } from "mongodb";

export interface TopicDocument {
  _id?: ObjectId;
  title: string;
  description?: string;
  order: number;
  level: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const TOPIC_COLLECTION = "topics";
