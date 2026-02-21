/**
 * Seed DB with test data for Poland: users (clients + pros), projects, pro_profiles.
 * Run: npx tsx scripts/seed.ts   (or npm run seed)
 */
import Database from "better-sqlite3";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

function shortSlug(): string {
  return crypto.randomBytes(6).toString("base64url").replace(/[-_]/g, "x").slice(0, 8);
}

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "commo.db");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function runSeed() {
  ensureDir(path.dirname(DB_PATH));
  const sqlite = new Database(DB_PATH);

  sqlite.exec(`
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
  `);
  try { sqlite.exec("ALTER TABLE projects ADD COLUMN city_slug TEXT"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE pro_profiles ADD COLUMN slug TEXT"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE pro_profiles ADD COLUMN plan TEXT DEFAULT 'free'"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE pro_profiles DROP COLUMN city_slug"); } catch { /* SQLite < 3.35 has no DROP COLUMN */ }
  try { sqlite.exec("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch { /* exists */ }
  try { sqlite.exec("ALTER TABLE users ADD COLUMN client_rating INTEGER"); } catch { /* exists */ }

  const now = Date.now();

  const cityList: { country_code: string; slug: string }[] = [
    { country_code: "pl", slug: "warsaw" }, { country_code: "pl", slug: "krakow" }, { country_code: "pl", slug: "gdansk" }, { country_code: "pl", slug: "wroclaw" }, { country_code: "pl", slug: "poznan" },
    { country_code: "ua", slug: "kyiv" }, { country_code: "ua", slug: "lviv" }, { country_code: "ua", slug: "odesa" }, { country_code: "ua", slug: "kharkiv" },
    { country_code: "de", slug: "berlin" }, { country_code: "de", slug: "munich" }, { country_code: "de", slug: "hamburg" }, { country_code: "de", slug: "cologne" },
    { country_code: "gb", slug: "london" }, { country_code: "gb", slug: "birmingham" }, { country_code: "gb", slug: "manchester" },
    { country_code: "us", slug: "newyork" }, { country_code: "us", slug: "losangeles" }, { country_code: "us", slug: "chicago" }, { country_code: "us", slug: "houston" },
    { country_code: "ca", slug: "toronto" }, { country_code: "ca", slug: "montreal" }, { country_code: "ca", slug: "vancouver" }, { country_code: "ca", slug: "calgary" },
    { country_code: "al", slug: "tirana" }, { country_code: "al", slug: "durres" }, { country_code: "al", slug: "vlore" },
    { country_code: "me", slug: "podgorica" }, { country_code: "me", slug: "niksic" }, { country_code: "me", slug: "budva" },
    { country_code: "bg", slug: "sofia" }, { country_code: "bg", slug: "plovdiv" }, { country_code: "bg", slug: "varna" }, { country_code: "bg", slug: "burgas" },
  ];
  sqlite.exec("DELETE FROM pro_profile_cities");
  sqlite.exec("DELETE FROM pro_profiles");
  sqlite.exec("DELETE FROM projects");
  sqlite.exec("DELETE FROM cities");
  sqlite.exec("DELETE FROM users WHERE country_code = 'pl'");

  const insCity = sqlite.prepare("INSERT INTO cities (country_code, slug) VALUES (?, ?)");
  for (const c of cityList) insCity.run(c.country_code, c.slug);

  const clients = [
    { email: "anna.kowalska@example.com", name: "Anna Kowalska" },
    { email: "piotr.nowak@example.com", name: "Piotr Nowak" },
    { email: "maria.wisniewska@example.com", name: "Maria Wiśniewska" },
    { email: "jan.lewandowski@example.com", name: "Jan Lewandowski" },
  ];
  const clientIds: number[] = [];
  for (const c of clients) {
    const r = sqlite.prepare(
      "INSERT INTO users (email, name, role, country_code, created_at) VALUES (?, ?, 'client', 'pl', ?)"
    ).run(c.email, c.name, now);
    clientIds.push(r.lastInsertRowid as number);
  }

  const pros = [
    { email: "tomasz.kowalczyk@example.com", name: "Tomasz Kowalczyk" },
    { email: "katarzyna.kaminska@example.com", name: "Katarzyna Kamińska" },
    { email: "andrzej.zielinski@example.com", name: "Andrzej Zieliński" },
    { email: "magdalena.szymanska@example.com", name: "Magdalena Szymańska" },
    { email: "michal.wojcik@example.com", name: "Michał Wójcik" },
  ];
  const proIds: number[] = [];
  for (const p of pros) {
    const r = sqlite.prepare(
      "INSERT INTO users (email, name, role, country_code, created_at) VALUES (?, ?, 'pro', 'pl', ?)"
    ).run(p.email, p.name, now);
    proIds.push(r.lastInsertRowid as number);
  }

  const plCities = ["warsaw", "krakow", "gdansk", "wroclaw", "poznan"];
  const projectTitles = [
    { cat: "cleaning", title: "Sprzątanie po remoncie", desc: "Mieszkanie 65 m², po remoncie." },
    { cat: "cleaning", title: "Regularne sprzątanie biura", desc: "Biuro ok. 100 m², 1x w tygodniu." },
    { cat: "plumbing", title: "Wymiana baterii i uszczelki", desc: "Kuchnia i łazienka." },
    { cat: "electrical", title: "Podłączenie lamp i gniazdek", desc: "Nowe mieszkanie, kilka punktów." },
    { cat: "construction", title: "Montaż ścianki działowej", desc: "Gips-karton, ok. 8 m²." },
    { cat: "painting", title: "Malowanie pokoju", desc: "Pokój 18 m², 2 warstwy." },
    { cat: "moving", title: "Przeprowadzka 2 pokoje", desc: "Z 2 piętra, bez windy." },
    { cat: "appliances", title: "Montaż pralki i podłączenie", desc: "Pralka Samsung, już kupiona." },
  ];
  const insProj = sqlite.prepare(
    "INSERT INTO projects (client_id, country_code, city_slug, category_slug, title, description, status, created_at) VALUES (?, 'pl', ?, ?, ?, ?, 'open', ?)"
  );
  projectTitles.forEach((p, i) => {
    insProj.run(clientIds[i % clientIds.length], plCities[i % plCities.length], p.cat, p.title, p.desc ?? null, now + i);
  });

  const categories = ["cleaning", "plumbing", "electrical", "construction", "painting", "moving", "appliances"];
  const plans: Array<"free" | "basic" | "premium"> = ["free", "free", "basic", "free", "premium"];
  const insPro = sqlite.prepare(
    "INSERT INTO pro_profiles (user_id, slug, plan, category_slug, rating, languages, verified, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insProCity = sqlite.prepare("INSERT INTO pro_profile_cities (pro_profile_id, city_slug) VALUES (?, ?)");
  const usedSlugs = new Set<string>();
  proIds.forEach((userId, idx) => {
    let slug = shortSlug();
    while (usedSlugs.has(slug)) slug = shortSlug();
    usedSlugs.add(slug);
    const cat = categories[idx % categories.length];
    const plan = plans[idx % plans.length];
    const r = insPro.run(userId, slug, plan, cat, 85 + (idx % 15), JSON.stringify(["pl", "en"]), idx % 3 !== 0 ? 1 : 0, `Doświadczony fachowiec, ${cat}.`);
    const proProfileId = r.lastInsertRowid as number;
    const numCities = plan === "free" ? 3 : plan === "basic" ? 5 : 10;
    for (let i = 0; i < Math.min(numCities, plCities.length); i++) {
      insProCity.run(proProfileId, plCities[(idx + i) % plCities.length]);
    }
  });

  const countCities = sqlite.prepare("SELECT COUNT(*) as c FROM cities").get() as { c: number };
  const countUsers = sqlite.prepare("SELECT COUNT(*) as c FROM users WHERE country_code = 'pl'").get() as { c: number };
  const countProjects = sqlite.prepare("SELECT COUNT(*) as c FROM projects WHERE country_code = 'pl'").get() as { c: number };
  const countPros = sqlite.prepare("SELECT COUNT(*) as c FROM pro_profiles").get() as { c: number };
  console.log("Seed done. cities=%d, Poland: users=%d, projects=%d, pro_profiles=%d", countCities.c, countUsers.c, countProjects.c, countPros.c);
  sqlite.close();
}

runSeed();
