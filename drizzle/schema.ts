import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Discord Bot Tables
export const discordServers = mysqlTable("discord_servers", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("serverId", { length: 64 }).notNull().unique(),
  serverName: text("serverName"),
  prefix: varchar("prefix", { length: 10 }).default("!").notNull(),
  aiEnabled: int("aiEnabled").default(1).notNull(),
  modLogChannelId: varchar("modLogChannelId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DiscordServer = typeof discordServers.$inferSelect;
export type InsertDiscordServer = typeof discordServers.$inferInsert;

export const discordUsers = mysqlTable("discord_users", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  serverId: varchar("serverId", { length: 64 }).notNull(),
  username: text("username"),
  warnings: int("warnings").default(0).notNull(),
  isMuted: int("isMuted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DiscordUser = typeof discordUsers.$inferSelect;
export type InsertDiscordUser = typeof discordUsers.$inferInsert;

export const commandLogs = mysqlTable("command_logs", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("serverId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  commandName: varchar("commandName", { length: 100 }).notNull(),
  arguments: text("arguments"),
  success: int("success").default(1).notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommandLog = typeof commandLogs.$inferSelect;
export type InsertCommandLog = typeof commandLogs.$inferInsert;

export const aiConversations = mysqlTable("ai_conversations", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("serverId", { length: 64 }).notNull(),
  channelId: varchar("channelId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  userMessage: text("userMessage").notNull(),
  aiResponse: text("aiResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = typeof aiConversations.$inferInsert;

export const moderationLogs = mysqlTable("moderation_logs", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("serverId", { length: 64 }).notNull(),
  targetUserId: varchar("targetUserId", { length: 64 }).notNull(),
  moderatorId: varchar("moderatorId", { length: 64 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModerationLog = typeof moderationLogs.$inferSelect;
export type InsertModerationLog = typeof moderationLogs.$inferInsert;