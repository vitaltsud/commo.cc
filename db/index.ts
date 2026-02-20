import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "commo.db");

export function getDb() {
  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
}

export * from "./schema";
