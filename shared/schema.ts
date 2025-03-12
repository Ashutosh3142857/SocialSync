import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  avatarUrl: true,
});

// Social Media Accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // twitter, instagram, facebook, linkedin, etc.
  accountName: text("account_name").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  isConnected: boolean("is_connected").notNull().default(true),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  userId: true,
  platform: true,
  accountName: true,
  accountId: true,
  accessToken: true,
  refreshToken: true,
  isConnected: true,
});

// Post content and scheduling
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(),
  scheduledFor: timestamp("scheduled_for"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  mediaUrls: true,
  scheduledFor: true,
  status: true,
});

// Platform-specific posts (linking a post to specific platforms)
export const platformPosts = pgTable("platform_posts", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  socialAccountId: integer("social_account_id").notNull().references(() => socialAccounts.id),
  platformStatus: text("platform_status").notNull().default("pending"), // pending, published, failed
  platformPostId: text("platform_post_id"), // ID of the post on the platform
  platformPostUrl: text("platform_post_url"), // URL to the post on the platform
  publishedAt: timestamp("published_at"),
  metrics: jsonb("metrics").default({}).notNull(), // Store metrics like views, likes, shares
});

export const insertPlatformPostSchema = createInsertSchema(platformPosts).pick({
  postId: true,
  socialAccountId: true,
  platformStatus: true,
  platformPostId: true,
  platformPostUrl: true,
  publishedAt: true,
  metrics: true,
});

// Analytics data
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  socialAccountId: integer("social_account_id").notNull().references(() => socialAccounts.id),
  date: timestamp("date").notNull(),
  metrics: jsonb("metrics").notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  socialAccountId: true,
  date: true,
  metrics: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PlatformPost = typeof platformPosts.$inferSelect;
export type InsertPlatformPost = z.infer<typeof insertPlatformPostSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

// Helper schemas for frontend validation
export const postFormSchema = z.object({
  content: z.string().min(1, "Content is required").max(2200, "Content too long"),
  mediaUrls: z.array(z.string()).optional().default([]),
  platforms: z.array(z.number()).min(1, "Select at least one platform"),
  scheduledFor: z.date().optional().nullable(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const platformSchema = z.enum(["twitter", "instagram", "facebook", "linkedin"]);
export type PlatformType = z.infer<typeof platformSchema>;
