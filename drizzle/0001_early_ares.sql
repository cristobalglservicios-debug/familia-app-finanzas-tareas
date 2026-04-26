CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`categoryId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`limitAmount` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `children` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`avatarColor` varchar(7) DEFAULT '#A8D5E2',
	`currentLevel` int NOT NULL DEFAULT 1,
	`totalPoints` int NOT NULL DEFAULT 0,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastStreakDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `children_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenseCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) DEFAULT '#000000',
	`icon` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenseCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`categoryId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`description` text,
	`date` date NOT NULL,
	`isRecurring` boolean DEFAULT false,
	`recurringFrequency` enum('daily','weekly','monthly','yearly'),
	`nextRecurrenceDate` date,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familySettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`adminUserId` int NOT NULL,
	`coAdminUserId` int,
	`familyName` varchar(255) DEFAULT 'Mi Familia',
	`currency` varchar(3) DEFAULT 'USD',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familySettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `levelConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` int NOT NULL,
	`requiredPoints` int NOT NULL,
	`badgeName` varchar(255),
	`badgeIcon` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `levelConfigs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pointsHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`amount` int NOT NULL,
	`reason` enum('task_completion','streak_bonus','reward_redemption','manual_adjustment','level_up') NOT NULL,
	`relatedId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pointsHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rewardRedemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rewardId` int NOT NULL,
	`childId` int NOT NULL,
	`pointsSpent` int NOT NULL,
	`status` enum('pending','approved','completed','cancelled') DEFAULT 'pending',
	`redeemedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewardRedemptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`pointsCost` int NOT NULL,
	`category` enum('screen_time','outing','treat','privilege','other') DEFAULT 'other',
	`quantity` int,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taskCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`childId` int NOT NULL,
	`completedDate` date NOT NULL,
	`pointsEarned` int NOT NULL,
	`streakBonus` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taskCompletions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`childId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`pointsValue` int NOT NULL,
	`frequency` enum('daily','weekly','monthly','once') NOT NULL DEFAULT 'daily',
	`daysOfWeek` varchar(50),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','user') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `familyRole` enum('admin','co-admin','child') DEFAULT 'child' NOT NULL;