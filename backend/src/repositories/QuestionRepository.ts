import { ObjectId } from "mongodb";
import { QuestionDocument, QUESTION_COLLECTION } from "../models/Question";
import { Database } from "../config/Database";

export class QuestionRepository {
  private get collection() {
    return Database.getInstance().getCollection<QuestionDocument>(QUESTION_COLLECTION);
  }

  async listByQuiz(quizId: string): Promise<QuestionDocument[]> {
    return this.collection.find({ quizId: new ObjectId(quizId) }).toArray();
  }

  async create(data: Omit<QuestionDocument, "_id">): Promise<QuestionDocument> {
    const result = await this.collection.insertOne(data as QuestionDocument);
    return { ...data, _id: result.insertedId } as QuestionDocument;
  }

  async update(id: string, data: Partial<QuestionDocument>): Promise<QuestionDocument | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}
