import { ObjectId } from "mongodb";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "../models/Vocabulary";
import { Database } from "../config/Database";

export class VocabularyRepository {
  private get collection() {
    return Database.getInstance().getCollection<VocabularyDocument>(VOCABULARY_COLLECTION);
  }

  async listByLesson(lessonId: string): Promise<VocabularyDocument[]> {
    return this.collection.find({ lessonId: new ObjectId(lessonId) }).toArray();
  }

  async listByTopic(topic?: string): Promise<VocabularyDocument[]> {
    const query = topic ? { topic } : {};
    return this.collection.find(query).toArray();
  }

  async create(data: Omit<VocabularyDocument, "_id">): Promise<VocabularyDocument> {
    const result = await this.collection.insertOne(data as VocabularyDocument);
    return { ...data, _id: result.insertedId } as VocabularyDocument;
  }

  async update(id: string, data: Partial<VocabularyDocument>): Promise<VocabularyDocument | null> {
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
