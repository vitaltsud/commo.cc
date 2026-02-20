import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/** Users: заказчики (client) и мастера (pro). */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role", { enum: ["client", "pro"] }).notNull(),
  countryCode: text("country_code").notNull(),
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

/** Профили мастеров: категория, город, рейтинг, языки, верификация. */
export const proProfiles = sqliteTable("pro_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  citySlug: text("city_slug"),
  categorySlug: text("category_slug").notNull(),
  rating: integer("rating"), // 0-100 or null
  languages: text("languages").notNull(), // JSON array e.g. ["pl","en"]
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  bio: text("bio"),
});

export type City = typeof cities.$inferSelect;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProProfile = typeof proProfiles.$inferSelect;
