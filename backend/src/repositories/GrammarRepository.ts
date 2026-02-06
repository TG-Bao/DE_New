import { ObjectId } from "mongodb";
import { GrammarDocument, GRAMMAR_COLLECTION } from "../models/Grammar";
import { Database } from "../config/Database";

export class GrammarRepository {
  private get collection() {
    return Database.getInstance().getCollection<GrammarDocument>(GRAMMAR_COLLECTION);
  }

  async listByLesson(lessonId: string): Promise<GrammarDocument[]> {
    return this.collection.find({ lessonId: new ObjectId(lessonId) }).toArray();
  }

  async create(data: Omit<GrammarDocument, "_id">): Promise<GrammarDocument> {
    const result = await this.collection.insertOne(data as GrammarDocument);
    return { ...data, _id: result.insertedId } as GrammarDocument;
  }

  async update(id: string, data: Partial<GrammarDocument>): Promise<GrammarDocument | null> {
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
