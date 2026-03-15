CREATE TABLE `ai_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` varchar(64) NOT NULL,
	`channelId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`userMessage` text NOT NULL,
	`aiResponse` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `command_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`commandName` varchar(100) NOT NULL,
	`arguments` text,
	`success` int NOT NULL DEFAULT 1,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `command_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discord_servers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` varchar(64) NOT NULL,
	`serverName` text,
	`prefix` varchar(10) NOT NULL DEFAULT '!',
	`aiEnabled` int NOT NULL DEFAULT 1,
	`modLogChannelId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discord_servers_id` PRIMARY KEY(`id`),
	CONSTRAINT `discord_servers_serverId_unique` UNIQUE(`serverId`)
);
--> statement-breakpoint
CREATE TABLE `discord_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(64) NOT NULL,
	`serverId` varchar(64) NOT NULL,
	`username` text,
	`warnings` int NOT NULL DEFAULT 0,
	`isMuted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discord_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderation_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` varchar(64) NOT NULL,
	`targetUserId` varchar(64) NOT NULL,
	`moderatorId` varchar(64) NOT NULL,
	`action` varchar(50) NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moderation_logs_id` PRIMARY KEY(`id`)
);
