import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};

if (!env.mongoUri || !env.jwtSecret) {
  // Fail fast in development so missing envs are obvious.
  // You can relax this if you want lazy checks.
  console.warn("Missing MONGO_URI or JWT_SECRET in environment");
}
