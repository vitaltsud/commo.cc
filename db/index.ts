import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "commo.db");

const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT,
    country_code TEXT NOT NULL,
    client_rating INTEGER,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_code TEXT NOT NULL,
    slug TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL REFERENCES users(id),
    country_code TEXT NOT NULL,
    city_slug TEXT,
    category_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS pro_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    slug TEXT,
    plan TEXT NOT NULL DEFAULT 'free',
    category_slug TEXT NOT NULL,
    rating INTEGER,
    languages TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    bio TEXT
  );
  CREATE TABLE IF NOT EXISTS pro_profile_cities (
    pro_profile_id INTEGER NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    city_slug TEXT NOT NULL,
    PRIMARY KEY (pro_profile_id, city_slug)
  );
`;

function ensureSchema(sqlite: Database.Database) {
  sqlite.exec(INIT_SQL);
  try { sqlite.exec("ALTER TABLE projects ADD COLUMN city_slug TEXT"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE pro_profiles ADD COLUMN slug TEXT"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE pro_profiles ADD COLUMN plan TEXT DEFAULT 'free'"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE users ADD COLUMN client_rating INTEGER"); } catch { /* exists */ }
}

export function getDb() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const sqlite = new Database(dbPath);
  ensureSchema(sqlite);
  return drizzle(sqlite, { schema });
}

export * from "./schema";
