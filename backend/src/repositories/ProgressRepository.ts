import { ObjectId } from "mongodb";
import { ProgressDocument, PROGRESS_COLLECTION } from "../models/Progress";
import { Database } from "../config/Database";

export class ProgressRepository {
  private get collection() {
    return Database.getInstance().getCollection<ProgressDocument>(PROGRESS_COLLECTION);
  }

  async getByUserId(userId: string): Promise<ProgressDocument | null> {
    return this.collection.findOne({ userId: new ObjectId(userId) });
  }

  async upsert(userId: string, data: Partial<ProgressDocument>): Promise<ProgressDocument> {
    const result = await this.collection.findOneAndUpdate(
      { userId: new ObjectId(userId) },
      { $set: data },
      { upsert: true, returnDocument: "after" }
    );
    return result as ProgressDocument;
  }
}
