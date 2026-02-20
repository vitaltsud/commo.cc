/**
 * Seed DB with test data for Poland: users (clients + pros), projects, pro_profiles.
 * Run: npx tsx scripts/seed.ts   (or npm run seed)
 */
import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

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
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('client','pro')),
      country_code TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL REFERENCES users(id),
      country_code TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pro_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      category_slug TEXT NOT NULL,
      rating INTEGER,
      languages TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0,
      bio TEXT
    );
  `);

  const now = Date.now();

  sqlite.exec("DELETE FROM pro_profiles");
  sqlite.exec("DELETE FROM projects");
  sqlite.exec("DELETE FROM users WHERE country_code = 'pl'");

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
  projectTitles.forEach((p, i) => {
    sqlite.prepare(
      "INSERT INTO projects (client_id, country_code, category_slug, title, description, status, created_at) VALUES (?, 'pl', ?, ?, ?, 'open', ?)"
    ).run(clientIds[i % clientIds.length], p.cat, p.title, p.desc ?? null, now + i);
  });

  const categories = ["cleaning", "plumbing", "electrical", "construction", "painting", "moving", "appliances"];
  proIds.forEach((userId, idx) => {
    const cat = categories[idx % categories.length];
    sqlite.prepare(
      "INSERT INTO pro_profiles (user_id, category_slug, rating, languages, verified, bio) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(userId, cat, 85 + (idx % 15), JSON.stringify(["pl", "en"]), idx % 3 !== 0 ? 1 : 0, `Doświadczony fachowiec, ${cat}.`);
  });

  const countUsers = sqlite.prepare("SELECT COUNT(*) as c FROM users WHERE country_code = 'pl'").get() as { c: number };
  const countProjects = sqlite.prepare("SELECT COUNT(*) as c FROM projects WHERE country_code = 'pl'").get() as { c: number };
  const countPros = sqlite.prepare("SELECT COUNT(*) as c FROM pro_profiles").get() as { c: number };
  console.log("Seed done. Poland: users=%d, projects=%d, pro_profiles=%d", countUsers.c, countProjects.c, countPros.c);
  sqlite.close();
}

runSeed();
