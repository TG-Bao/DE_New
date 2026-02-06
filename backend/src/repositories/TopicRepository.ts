import { ObjectId } from "mongodb";
import { TopicDocument, TOPIC_COLLECTION } from "../models/Topic";
import { Database } from "../config/Database";

export class TopicRepository {
  private get collection() {
    return Database.getInstance().getCollection<TopicDocument>(TOPIC_COLLECTION);
  }

  async listPublished(): Promise<TopicDocument[]> {
    return this.collection.find({ isPublished: true }).sort({ order: 1 }).toArray();
  }

  async listAll(): Promise<TopicDocument[]> {
    return this.collection.find().sort({ order: 1 }).toArray();
  }

  async findById(id: string): Promise<TopicDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<TopicDocument, "_id">): Promise<TopicDocument> {
    const result = await this.collection.insertOne(data as TopicDocument);
    return { ...data, _id: result.insertedId } as TopicDocument;
  }

  async update(id: string, data: Partial<TopicDocument>): Promise<TopicDocument | null> {
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
