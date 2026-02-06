import { ObjectId } from "mongodb";
import { UserDocument, USER_COLLECTION } from "../models/User";
import { Database } from "../config/Database";

export class UserRepository {
  private get collection() {
    return Database.getInstance().getCollection<UserDocument>(USER_COLLECTION);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.collection.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<UserDocument, "_id">): Promise<UserDocument> {
    const result = await this.collection.insertOne(data as UserDocument);
    return { ...data, _id: result.insertedId } as UserDocument;
  }
}
