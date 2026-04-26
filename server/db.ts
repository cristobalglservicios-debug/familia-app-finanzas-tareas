import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  children,
  expenses,
  expenseCategories,
  tasks,
  taskCompletions,
  rewards,
  rewardRedemptions,
  pointsHistory,
  budgets,
  familySettings,
  levelConfigs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== FAMILY SETTINGS =====
export async function getFamilySettings(familyId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(familySettings)
    .where(eq(familySettings.familyId, familyId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createFamilySettings(
  familyId: number,
  adminUserId: number,
  familyName: string = "Mi Familia"
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(familySettings)
    .values({
      familyId,
      adminUserId,
      familyName,
    });

  return result;
}

// ===== CHILDREN =====
export async function getChildrenByFamilyId(familyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(children)
    .where(eq(children.familyId, familyId))
    .orderBy(children.createdAt);
}

export async function getChildById(childId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(children)
    .where(eq(children.id, childId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createChild(
  familyId: number,
  name: string,
  age: number,
  avatarColor: string = "#A8D5E2"
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(children).values({
    familyId,
    name,
    age,
    avatarColor,
  });

  return result;
}

export async function updateChild(
  childId: number,
  updates: Partial<{
    name: string;
    age: number;
    avatarColor: string;
    currentLevel: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastStreakDate: Date | null;
  }>
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.update(children).set(updates).where(eq(children.id, childId));
}

// ===== EXPENSE CATEGORIES =====
export async function getExpenseCategoriesByFamilyId(familyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(expenseCategories)
    .where(eq(expenseCategories.familyId, familyId))
    .orderBy(expenseCategories.createdAt);
}

export async function createExpenseCategory(
  familyId: number,
  name: string,
  color: string = "#000000",
  icon?: string
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(expenseCategories).values({
    familyId,
    name,
    color,
    icon,
  });
}

// ===== EXPENSES =====
export async function getExpensesByFamilyAndMonth(
  familyId: number,
  year: number,
  month: number
) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.familyId, familyId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .orderBy(desc(expenses.date));
}

export async function createExpense(
  familyId: number,
  categoryId: number,
  amount: string,
  date: Date,
  createdBy: number,
  description?: string,
  isRecurring: boolean = false,
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly",
  nextRecurrenceDate?: Date
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(expenses).values({
    familyId,
    categoryId,
    amount,
    date,
    createdBy,
    description,
    isRecurring,
    recurringFrequency: isRecurring ? recurringFrequency : undefined,
    nextRecurrenceDate: isRecurring ? nextRecurrenceDate : undefined,
  });
}

// ===== TASKS =====
export async function getTasksByChildId(childId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.childId, childId), eq(tasks.isActive, true)))
    .orderBy(tasks.createdAt);
}

export async function getTaskById(taskId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createTask(
  familyId: number,
  childId: number,
  title: string,
  pointsValue: number,
  frequency: "daily" | "weekly" | "monthly" | "once" = "daily",
  description?: string,
  daysOfWeek?: string
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(tasks).values({
    familyId,
    childId,
    title,
    description,
    pointsValue,
    frequency,
    daysOfWeek,
  });
}

// ===== TASK COMPLETIONS =====
export async function getTaskCompletionsByChildAndDate(
  childId: number,
  date: Date
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(taskCompletions)
    .where(
      and(
        eq(taskCompletions.childId, childId),
        eq(taskCompletions.completedDate, date)
      )
    );
}

export async function createTaskCompletion(
  taskId: number,
  childId: number,
  completedDate: Date,
  pointsEarned: number,
  streakBonus: number = 0
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(taskCompletions).values({
    taskId,
    childId,
    completedDate,
    pointsEarned,
    streakBonus,
  });
}

// ===== REWARDS =====
export async function getRewardsByFamilyId(familyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(rewards)
    .where(and(eq(rewards.familyId, familyId), eq(rewards.isActive, true)))
    .orderBy(rewards.createdAt);
}

export async function createReward(
  familyId: number,
  title: string,
  pointsCost: number,
  category: "screen_time" | "outing" | "treat" | "privilege" | "other" = "other",
  description?: string,
  quantity?: number
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(rewards).values({
    familyId,
    title,
    description,
    pointsCost,
    category,
    quantity,
  });
}

// ===== REWARD REDEMPTIONS =====
export async function createRewardRedemption(
  rewardId: number,
  childId: number,
  pointsSpent: number
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(rewardRedemptions).values({
    rewardId,
    childId,
    pointsSpent,
    status: "pending",
  });
}

export async function getPendingRedemptions(childId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(rewardRedemptions)
    .where(
      and(
        eq(rewardRedemptions.childId, childId),
        eq(rewardRedemptions.status, "pending")
      )
    )
    .orderBy(desc(rewardRedemptions.redeemedAt));
}

// ===== POINTS HISTORY =====
export async function addPointsHistory(
  childId: number,
  amount: number,
  reason: "task_completion" | "streak_bonus" | "reward_redemption" | "manual_adjustment" | "level_up",
  relatedId?: number
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(pointsHistory).values({
    childId,
    amount,
    reason,
    relatedId,
  });
}

export async function getPointsHistoryByChild(childId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(pointsHistory)
    .where(eq(pointsHistory.childId, childId))
    .orderBy(desc(pointsHistory.createdAt))
    .limit(limit);
}

// ===== BUDGETS =====
export async function getBudgetByFamilyAndMonth(
  familyId: number,
  month: string
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(budgets)
    .where(
      and(eq(budgets.familyId, familyId), eq(budgets.month, month))
    );
}

export async function createBudget(
  familyId: number,
  categoryId: number,
  month: string,
  limitAmount: string
) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(budgets).values({
    familyId,
    categoryId,
    month,
    limitAmount,
  });
}

// ===== LEVEL CONFIGS =====
export async function getLevelConfigs() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(levelConfigs)
    .orderBy(levelConfigs.level);
}

export async function initializeLevelConfigs() {
  const db = await getDb();
  if (!db) return;

  const defaultLevels = [
    { level: 1, requiredPoints: 0, badgeName: "Principiante", badgeIcon: "star" },
    { level: 2, requiredPoints: 100, badgeName: "Aprendiz", badgeIcon: "star-2" },
    { level: 3, requiredPoints: 250, badgeName: "Experto", badgeIcon: "star-3" },
    { level: 4, requiredPoints: 500, badgeName: "Maestro", badgeIcon: "crown" },
    { level: 5, requiredPoints: 1000, badgeName: "Campeón", badgeIcon: "trophy" },
  ];

  for (const level of defaultLevels) {
    await db.insert(levelConfigs).values(level);
  }
}
