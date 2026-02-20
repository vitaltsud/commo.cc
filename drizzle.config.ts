import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: { url: process.env.DATABASE_PATH ?? "./data/commo.db" },
  out: "./db/migrations",
});
