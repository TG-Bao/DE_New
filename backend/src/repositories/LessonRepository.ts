import { ObjectId } from "mongodb";
import { LessonDocument, LESSON_COLLECTION } from "../models/Lesson";
import { Database } from "../config/Database";

export class LessonRepository {
  private get collection() {
    return Database.getInstance().getCollection<LessonDocument>(LESSON_COLLECTION);
  }

  async listByTopic(topicId: string, publishedOnly = true): Promise<LessonDocument[]> {
    const query: any = { topicId: new ObjectId(topicId) };
    if (publishedOnly) {
      query.isPublished = true;
    }
    return this.collection.find(query).sort({ order: 1 }).toArray();
  }

  async findById(id: string): Promise<LessonDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<LessonDocument, "_id">): Promise<LessonDocument> {
    const result = await this.collection.insertOne(data as LessonDocument);
    return { ...data, _id: result.insertedId } as LessonDocument;
  }

  async update(id: string, data: Partial<LessonDocument>): Promise<LessonDocument | null> {
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
