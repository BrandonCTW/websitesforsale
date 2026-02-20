import { pgTable, text, integer, boolean, timestamp, serial, json } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  username: text("username").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
})

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  askingPrice: integer("asking_price").notNull(),
  monthlyRevenue: integer("monthly_revenue"),
  monthlyProfit: integer("monthly_profit"),
  monthlyTraffic: integer("monthly_traffic"),
  ageMonths: integer("age_months").notNull(),
  monetization: json("monetization").$type<string[]>().default([]),
  techStack: json("tech_stack").$type<string[]>().default([]),
  reasonForSelling: text("reason_for_selling").notNull(),
  includedAssets: text("included_assets"),
  status: text("status").notNull().default("active"), // active | under_offer | sold | unpublished
  faqs: json("faqs").$type<Array<{ q: string; a: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const listingImages = pgTable("listing_images", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.id, { onDelete: "cascade" }).notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type Listing = typeof listings.$inferSelect
export type ListingImage = typeof listingImages.$inferSelect
export type Inquiry = typeof inquiries.$inferSelect
