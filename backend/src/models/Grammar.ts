import { ObjectId } from "mongodb";

export interface GrammarDocument {
  _id?: ObjectId;
  lessonId: ObjectId;
  title: string;
  description: string;
  examples: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const GRAMMAR_COLLECTION = "grammars";
