import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

// ===== HELPER FUNCTIONS =====
async function calculateChildLevel(totalPoints: number) {
  const levelConfigs = await db.getLevelConfigs();
  let level = 1;
  for (const config of levelConfigs) {
    if (totalPoints >= config.requiredPoints) {
      level = config.level;
    } else {
      break;
    }
  }
  return level;
}

async function calculateStreak(childId: number) {
  const child = await db.getChildById(childId);
  if (!child) return { currentStreak: 0, longestStreak: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await db.getTasksByChildId(childId);
  if (tasks.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = child.currentStreak || 0;
  let longestStreak = child.longestStreak || 0;

  // Check if all tasks were completed today
  const completionsToday = await db.getTaskCompletionsByChildAndDate(childId, today);
  const allTasksCompleted = tasks.length === completionsToday.length;

  if (allTasksCompleted && child.lastStreakDate) {
    const lastDate = new Date(child.lastStreakDate);
    lastDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      currentStreak = (child.currentStreak || 0) + 1;
      longestStreak = Math.max(currentStreak, child.longestStreak || 0);
    } else if (daysDiff > 1) {
      currentStreak = 1;
    }
  } else if (allTasksCompleted && !child.lastStreakDate) {
    currentStreak = 1;
  } else if (!allTasksCompleted) {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
}

// ===== ROUTERS =====
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== FAMILY SETTINGS =====
  family: router({
    getSettings: protectedProcedure
      .input(z.object({ familyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFamilySettings(input.familyId);
      }),

    createSettings: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          adminUserId: z.number(),
          familyName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createFamilySettings(
          input.familyId,
          input.adminUserId,
          input.familyName
        );
      }),
  }),

  // ===== CHILDREN MANAGEMENT =====
  children: router({
    list: protectedProcedure
      .input(z.object({ familyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getChildrenByFamilyId(input.familyId);
      }),

    get: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(async ({ input }) => {
        return await db.getChildById(input.childId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          name: z.string(),
          age: z.number(),
          avatarColor: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createChild(
          input.familyId,
          input.name,
          input.age,
          input.avatarColor
        );
      }),

    update: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          name: z.string().optional(),
          age: z.number().optional(),
          avatarColor: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { childId, ...updates } = input;
        return await db.updateChild(childId, updates);
      }),
  }),

  // ===== EXPENSES =====
  expenses: router({
    listByMonth: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        return await db.getExpensesByFamilyAndMonth(
          input.familyId,
          input.year,
          input.month
        );
      }),

    create: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          categoryId: z.number(),
          amount: z.string(),
          date: z.date(),
          description: z.string().optional(),
          isRecurring: z.boolean().optional(),
          recurringFrequency: z
            .enum(["daily", "weekly", "monthly", "yearly"])
            .optional(),
          nextRecurrenceDate: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        return await db.createExpense(
          input.familyId,
          input.categoryId,
          input.amount,
          input.date,
          ctx.user.id,
          input.description,
          input.isRecurring,
          input.recurringFrequency,
          input.nextRecurrenceDate
        );
      }),
  }),

  // ===== EXPENSE CATEGORIES =====
  categories: router({
    list: protectedProcedure
      .input(z.object({ familyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getExpenseCategoriesByFamilyId(input.familyId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          name: z.string(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createExpenseCategory(
          input.familyId,
          input.name,
          input.color,
          input.icon
        );
      }),
  }),

  // ===== TASKS =====
  tasks: router({
    listByChild: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(async ({ input }) => {
        return await db.getTasksByChildId(input.childId);
      }),

    get: protectedProcedure
      .input(z.object({ taskId: z.number() }))
      .query(async ({ input }) => {
        return await db.getTaskById(input.taskId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          childId: z.number(),
          title: z.string(),
          pointsValue: z.number(),
          frequency: z
            .enum(["daily", "weekly", "monthly", "once"])
            .optional(),
          description: z.string().optional(),
          daysOfWeek: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createTask(
          input.familyId,
          input.childId,
          input.title,
          input.pointsValue,
          input.frequency,
          input.description,
          input.daysOfWeek
        );
      }),
  }),

  // ===== TASK COMPLETIONS & GAMIFICATION =====
  gamification: router({
    completeTask: protectedProcedure
      .input(
        z.object({
          taskId: z.number(),
          childId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const task = await db.getTaskById(input.taskId);
        if (!task) throw new Error("Task not found");

        const child = await db.getChildById(input.childId);
        if (!child) throw new Error("Child not found");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already completed today
        const existing = await db.getTaskCompletionsByChildAndDate(
          input.childId,
          today
        );
        if (existing.some((c) => c.taskId === input.taskId)) {
          throw new Error("Task already completed today");
        }

        // Calculate streak bonus
        const { currentStreak } = await calculateStreak(input.childId);
        const streakBonus = currentStreak > 0 ? Math.floor(task.pointsValue * 0.1) : 0;
        const totalPoints = task.pointsValue + streakBonus;

        // Create task completion
        await db.createTaskCompletion(
          input.taskId,
          input.childId,
          today,
          task.pointsValue,
          streakBonus
        );

        // Update child points
        const newTotalPoints = child.totalPoints + totalPoints;
        const newLevel = await calculateChildLevel(newTotalPoints);
        const { currentStreak: newStreak, longestStreak: newLongestStreak } =
          await calculateStreak(input.childId);

        await db.updateChild(input.childId, {
          totalPoints: newTotalPoints,
          currentLevel: newLevel,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastStreakDate: today,
        });

        // Add to points history
        await db.addPointsHistory(
          input.childId,
          totalPoints,
          "task_completion",
          input.taskId
        );

        if (streakBonus > 0) {
          await db.addPointsHistory(
            input.childId,
            streakBonus,
            "streak_bonus",
            input.taskId
          );
        }

        return {
          success: true,
          pointsEarned: task.pointsValue,
          streakBonus,
          totalPoints: newTotalPoints,
          newLevel,
          currentStreak: newStreak,
        };
      }),

    getChildStats: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(async ({ input }) => {
        const child = await db.getChildById(input.childId);
        if (!child) throw new Error("Child not found");

        const { currentStreak, longestStreak } = await calculateStreak(
          input.childId
        );

        return {
          name: child.name,
          age: child.age,
          totalPoints: child.totalPoints,
          currentLevel: child.currentLevel,
          currentStreak,
          longestStreak,
          avatarColor: child.avatarColor,
        };
      }),

    getPointsHistory: protectedProcedure
      .input(z.object({ childId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getPointsHistoryByChild(input.childId, input.limit);
      }),
  }),

  // ===== REWARDS =====
  rewards: router({
    list: protectedProcedure
      .input(z.object({ familyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getRewardsByFamilyId(input.familyId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          title: z.string(),
          pointsCost: z.number(),
          category: z
            .enum(["screen_time", "outing", "treat", "privilege", "other"])
            .optional(),
          description: z.string().optional(),
          quantity: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createReward(
          input.familyId,
          input.title,
          input.pointsCost,
          input.category,
          input.description,
          input.quantity
        );
      }),

    redeem: protectedProcedure
      .input(
        z.object({
          rewardId: z.number(),
          childId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const reward = await db.getRewardsByFamilyId(1); // TODO: Get familyId from context
        const rewardItem = reward.find((r) => r.id === input.rewardId);
        if (!rewardItem) throw new Error("Reward not found");

        const child = await db.getChildById(input.childId);
        if (!child) throw new Error("Child not found");

        if (child.totalPoints < rewardItem.pointsCost) {
          throw new Error("Insufficient points");
        }

        // Create redemption
        await db.createRewardRedemption(
          input.rewardId,
          input.childId,
          rewardItem.pointsCost
        );

        // Deduct points
        const newTotalPoints = child.totalPoints - rewardItem.pointsCost;
        await db.updateChild(input.childId, {
          totalPoints: newTotalPoints,
        });

        // Add to points history
        await db.addPointsHistory(
          input.childId,
          -rewardItem.pointsCost,
          "reward_redemption",
          input.rewardId
        );

        return {
          success: true,
          remainingPoints: newTotalPoints,
        };
      }),

    getPendingRedemptions: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPendingRedemptions(input.childId);
      }),
  }),

  // ===== BUDGETS =====
  budgets: router({
    getByMonth: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          month: z.string(),
        })
      )
      .query(async ({ input }) => {
        return await db.getBudgetByFamilyAndMonth(input.familyId, input.month);
      }),

    create: protectedProcedure
      .input(
        z.object({
          familyId: z.number(),
          categoryId: z.number(),
          month: z.string(),
          limitAmount: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createBudget(
          input.familyId,
          input.categoryId,
          input.month,
          input.limitAmount
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;
