import { ObjectId } from "mongodb";
import { QuizDocument, QUIZ_COLLECTION } from "../models/Quiz";
import { Database } from "../config/Database";

export class QuizRepository {
  private get collection() {
    return Database.getInstance().getCollection<QuizDocument>(QUIZ_COLLECTION);
  }

  async listPublished(): Promise<QuizDocument[]> {
    return this.collection.find({ isPublished: true }).toArray();
  }

  async listAll(): Promise<QuizDocument[]> {
    return this.collection.find().toArray();
  }

  async listByScope(scopeType: string, scopeId?: string): Promise<QuizDocument[]> {
    const query: any = { scopeType, isPublished: true };
    if (scopeId) {
      query.scopeId = new ObjectId(scopeId);
    }
    return this.collection.find(query).toArray();
  }

  async findById(id: string): Promise<QuizDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<QuizDocument, "_id">): Promise<QuizDocument> {
    const result = await this.collection.insertOne(data as QuizDocument);
    return { ...data, _id: result.insertedId } as QuizDocument;
  }

  async update(id: string, data: Partial<QuizDocument>): Promise<QuizDocument | null> {
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
