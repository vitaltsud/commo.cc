import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

/**
 * Users: один аккаунт может быть и заказчиком, и мастером.
 * «Клиент» = может публиковать проекты (без верификации).
 * «Мастер» = есть хотя бы один верифицированный pro_profile (верификация обязательна).
 * googleId — привязка к OAuth; role — устаревшее, оставлено для совместимости с сидом.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  googleId: text("google_id").unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role", { enum: ["client", "pro"] }),
  countryCode: text("country_code").notNull(),
  /** Рейтинг как заказчик (оставляют мастера); отдельно от рейтинга мастера. */
  clientRating: integer("client_rating"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

/** Города по странам (переводы в messages: city.{slug}). */
export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code").notNull(),
  slug: text("slug").notNull(),
});

/** Проекты заказчиков. */
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id").notNull().references(() => users.id),
  countryCode: text("country_code").notNull(),
  citySlug: text("city_slug"),
  categorySlug: text("category_slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["draft", "open", "in_progress", "done"] }).notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

/** План мастера: лимит городов (free=3, basic=5, premium=10 и т.д.). */
export type ProPlanCode = "free" | "basic" | "premium";

/** Профили мастеров: категория, рейтинг, языки, верификация. Города — в pro_profile_cities. */
export const proProfiles = sqliteTable("pro_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  slug: text("slug"), // short unique hash for URL /pl/contractor/slug
  plan: text("plan", { enum: ["free", "basic", "premium"] }).notNull().default("free"),
  categorySlug: text("category_slug").notNull(),
  rating: integer("rating"), // 0-100 or null
  languages: text("languages").notNull(), // JSON array e.g. ["pl","en"]
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  bio: text("bio"),
});

/** Города, в которых работает мастер (от 3 на free, больше на платных планах). */
export const proProfileCities = sqliteTable(
  "pro_profile_cities",
  {
    proProfileId: integer("pro_profile_id").notNull().references(() => proProfiles.id, { onDelete: "cascade" }),
    citySlug: text("city_slug").notNull(),
  },
  (t) => [primaryKey({ columns: [t.proProfileId, t.citySlug] })]
);

export type City = typeof cities.$inferSelect;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProProfile = typeof proProfiles.$inferSelect;
export type ProProfileCity = typeof proProfileCities.$inferSelect;
