import { ObjectId } from "mongodb";

export type UserRole = "USER" | "ADMIN";

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export const USER_COLLECTION = "users";
