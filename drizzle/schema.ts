import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with family-specific fields for roles and relationships.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  familyRole: mysqlEnum("familyRole", ["admin", "co-admin", "child"]).default("child").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Children profiles table - stores information about each child in the family
 */
export const children = mysqlTable("children", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(), // Reference to family group (for future multi-family support)
  userId: int("userId"), // Optional reference to user if child has their own account
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  avatarColor: varchar("avatarColor", { length: 7 }).default("#A8D5E2"), // Hex color for avatar
  currentLevel: int("currentLevel").default(1).notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastStreakDate: date("lastStreakDate"), // Last date streak was updated
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Child = typeof children.$inferSelect;
export type InsertChild = typeof children.$inferInsert;

/**
 * Expense categories - predefined categories for organizing expenses
 */
export const expenseCategories = mysqlTable("expenseCategories", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Alimentación", "Servicios", "Transporte", "Ocio"
  color: varchar("color", { length: 7 }).default("#000000"), // Hex color for category
  icon: varchar("icon", { length: 50 }), // Icon name for UI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertExpenseCategory = typeof expenseCategories.$inferInsert;

/**
 * Expenses table - tracks all family expenses
 */
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  categoryId: int("categoryId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  isRecurring: boolean("isRecurring").default(false),
  recurringFrequency: mysqlEnum("recurringFrequency", ["daily", "weekly", "monthly", "yearly"]),
  nextRecurrenceDate: date("nextRecurrenceDate"),
  createdBy: int("createdBy").notNull(), // User ID who created the expense
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * Monthly budgets - tracks budget limits per category per month
 */
export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  categoryId: int("categoryId").notNull(),
  month: varchar("month", { length: 7 }).notNull(), // Format: YYYY-MM
  limitAmount: decimal("limitAmount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

/**
 * Tasks table - stores daily/weekly tasks for children
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  childId: int("childId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  pointsValue: int("pointsValue").notNull(), // Points earned when completed
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly", "once"]).default("daily").notNull(),
  daysOfWeek: varchar("daysOfWeek", { length: 50 }), // Comma-separated: 0-6 (Sun-Sat) for weekly tasks
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Task completions - tracks when tasks are marked as completed
 */
export const taskCompletions = mysqlTable("taskCompletions", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull(),
  childId: int("childId").notNull(),
  completedDate: date("completedDate").notNull(),
  pointsEarned: int("pointsEarned").notNull(),
  streakBonus: int("streakBonus").default(0), // Extra points from streak bonus
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type InsertTaskCompletion = typeof taskCompletions.$inferInsert;

/**
 * Rewards table - stores available rewards in the family store
 */
export const rewards = mysqlTable("rewards", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  pointsCost: int("pointsCost").notNull(),
  category: mysqlEnum("category", ["screen_time", "outing", "treat", "privilege", "other"]).default("other"),
  quantity: int("quantity"), // Available quantity (null = unlimited)
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = typeof rewards.$inferInsert;

/**
 * Reward redemptions - tracks when children redeem rewards
 */
export const rewardRedemptions = mysqlTable("rewardRedemptions", {
  id: int("id").autoincrement().primaryKey(),
  rewardId: int("rewardId").notNull(),
  childId: int("childId").notNull(),
  pointsSpent: int("pointsSpent").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "completed", "cancelled"]).default("pending"),
  redeemedAt: timestamp("redeemedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RewardRedemption = typeof rewardRedemptions.$inferSelect;
export type InsertRewardRedemption = typeof rewardRedemptions.$inferInsert;

/**
 * Points history - audit trail of all point transactions
 */
export const pointsHistory = mysqlTable("pointsHistory", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  amount: int("amount").notNull(), // Positive or negative
  reason: mysqlEnum("reason", ["task_completion", "streak_bonus", "reward_redemption", "manual_adjustment", "level_up"]).notNull(),
  relatedId: int("relatedId"), // ID of related task, reward, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PointsHistory = typeof pointsHistory.$inferSelect;
export type InsertPointsHistory = typeof pointsHistory.$inferInsert;

/**
 * Levels configuration - defines point thresholds for each level
 */
export const levelConfigs = mysqlTable("levelConfigs", {
  id: int("id").autoincrement().primaryKey(),
  level: int("level").notNull(),
  requiredPoints: int("requiredPoints").notNull(),
  badgeName: varchar("badgeName", { length: 255 }),
  badgeIcon: varchar("badgeIcon", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LevelConfig = typeof levelConfigs.$inferSelect;
export type InsertLevelConfig = typeof levelConfigs.$inferInsert;

/**
 * Family settings - stores configuration for each family
 */
export const familySettings = mysqlTable("familySettings", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  adminUserId: int("adminUserId").notNull(), // Ana's user ID
  coAdminUserId: int("coAdminUserId"), // Optional co-admin user ID
  familyName: varchar("familyName", { length: 255 }).default("Mi Familia"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FamilySettings = typeof familySettings.$inferSelect;
export type InsertFamilySettings = typeof familySettings.$inferInsert;


/**
 * Weekly budgets - tracks budget limits per week
 */
export const weeklyBudgets = mysqlTable("weeklyBudgets", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  weekStartDate: date("weekStartDate").notNull(), // Monday of the week
  totalLimit: decimal("totalLimit", { precision: 10, scale: 2 }).notNull(),
  spent: decimal("spent", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeeklyBudget = typeof weeklyBudgets.$inferSelect;
export type InsertWeeklyBudget = typeof weeklyBudgets.$inferInsert;

/**
 * Fixed payments - recurring payments like rent, utilities, internet
 */
export const fixedPayments = mysqlTable("fixedPayments", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Renta", "Luz", "Internet"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDay: int("dueDay").notNull(), // Day of month (1-31)
  frequency: mysqlEnum("frequency", ["monthly", "quarterly", "yearly"]).default("monthly"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FixedPayment = typeof fixedPayments.$inferSelect;
export type InsertFixedPayment = typeof fixedPayments.$inferInsert;

/**
 * Expense splits - tracks how expenses are divided among family members
 */
export const expenseSplits = mysqlTable("expenseSplits", {
  id: int("id").autoincrement().primaryKey(),
  expenseId: int("expenseId").notNull(),
  childId: int("childId"), // If null, it's for the whole family
  splitAmount: decimal("splitAmount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpenseSplit = typeof expenseSplits.$inferSelect;
export type InsertExpenseSplit = typeof expenseSplits.$inferInsert;

/**
 * Family wall posts - for sharing achievements and photos
 */
export const wallPosts = mysqlTable("wallPosts", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  childId: int("childId").notNull(),
  content: text("content").notNull(),
  postType: mysqlEnum("postType", ["achievement", "photo", "message", "evidence"]).default("message"),
  imageUrl: varchar("imageUrl", { length: 500 }), // URL to uploaded image
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WallPost = typeof wallPosts.$inferSelect;
export type InsertWallPost = typeof wallPosts.$inferInsert;

/**
 * Wall comments - comments on wall posts
 */
export const wallComments = mysqlTable("wallComments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  childId: int("childId").notNull(), // Who commented
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WallComment = typeof wallComments.$inferSelect;
export type InsertWallComment = typeof wallComments.$inferInsert;

/**
 * Wall likes - tracks who liked which posts
 */
export const wallLikes = mysqlTable("wallLikes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  childId: int("childId").notNull(), // Who liked
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WallLike = typeof wallLikes.$inferSelect;
export type InsertWallLike = typeof wallLikes.$inferInsert;

/**
 * Task evidence - photos/evidence of completed tasks
 */
export const taskEvidence = mysqlTable("taskEvidence", {
  id: int("id").autoincrement().primaryKey(),
  taskCompletionId: int("taskCompletionId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TaskEvidence = typeof taskEvidence.$inferSelect;
export type InsertTaskEvidence = typeof taskEvidence.$inferInsert;
