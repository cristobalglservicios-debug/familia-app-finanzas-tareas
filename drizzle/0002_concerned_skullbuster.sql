CREATE TABLE `expenseSplits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expenseId` int NOT NULL,
	`childId` int,
	`splitAmount` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenseSplits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fixedPayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`dueDay` int NOT NULL,
	`frequency` enum('monthly','quarterly','yearly') DEFAULT 'monthly',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fixedPayments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taskEvidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskCompletionId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taskEvidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`childId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`childId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`childId` int NOT NULL,
	`content` text NOT NULL,
	`postType` enum('achievement','photo','message','evidence') DEFAULT 'message',
	`imageUrl` varchar(500),
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weeklyBudgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`weekStartDate` date NOT NULL,
	`totalLimit` decimal(10,2) NOT NULL,
	`spent` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weeklyBudgets_id` PRIMARY KEY(`id`)
);
