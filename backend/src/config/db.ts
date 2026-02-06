import { Database } from "./Database";

export const connectDb = async (): Promise<void> => {
  const db = Database.getInstance();
  await db.connect();
};
