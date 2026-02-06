import { ObjectId } from "mongodb";

export interface VocabularyDocument {
  _id?: ObjectId;
  lessonId: ObjectId;
  word: string;
  meaning: string;
  phonetic?: string;
  audioUrl?: string;
  example: string;
  topic: string;
  level: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const VOCABULARY_COLLECTION = "vocabularies";
