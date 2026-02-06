import { MongoClient, Db, Collection } from "mongodb";
import { env } from "./env";

export class Database {
  private static instance: Database;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    if (!env.mongoUri) {
      throw new Error("MONGO_URI is not configured");
    }
    this.client = new MongoClient(env.mongoUri);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db();
      console.log("MongoDB connected successfully via native driver");
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  public getCollection<T extends Document>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.db = null;
    console.log("MongoDB connection closed");
  }
}

// Helper for type safety if needed
import { Document } from "mongodb";
