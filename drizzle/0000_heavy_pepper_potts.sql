CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contestId` int NOT NULL,
	`contestSlug` varchar(120) NOT NULL,
	`contestTitle` varchar(255) NOT NULL,
	`discipline` varchar(64) NOT NULL,
	`participantName` varchar(200) NOT NULL,
	`collectiveName` varchar(200),
	`ageCategory` varchar(100) NOT NULL,
	`nomination` varchar(180) NOT NULL,
	`performanceTitle` varchar(255) NOT NULL,
	`videoUrl` text NOT NULL,
	`teacherName` varchar(200),
	`institution` varchar(255),
	`city` varchar(120) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(60) NOT NULL,
	`comment` text,
	`status` enum('new','paid','reviewed','rejected') NOT NULL DEFAULT 'new',
	`paymentAmount` int NOT NULL DEFAULT 790,
	`paymentInvoiceId` varchar(120),
	`paymentStatus` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contest_regulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contestId` int NOT NULL,
	`sectionKey` varchar(64) NOT NULL,
	`title` varchar(160) NOT NULL,
	`content` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contest_regulations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contest_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`publishedDate` varchar(64) NOT NULL,
	`periodLabel` varchar(120),
	`summary` text NOT NULL,
	`fullReport` text NOT NULL,
	`protocolUrl` text,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contest_reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `contest_reports_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(255) NOT NULL,
	`shortTitle` varchar(160),
	`discipline` enum('vocal','choreography','theater','instrumental','circus','art') NOT NULL,
	`disciplineLabel` varchar(80) NOT NULL,
	`badge` varchar(80) NOT NULL DEFAULT 'Регулярный проект',
	`status` enum('active','archived','draft') NOT NULL DEFAULT 'active',
	`receptionPeriod` varchar(160) NOT NULL,
	`resultsPeriod` varchar(160) NOT NULL,
	`feeAmount` int NOT NULL DEFAULT 790,
	`cardImage` text NOT NULL,
	`bannerImage` text,
	`accentColor` varchar(32) NOT NULL DEFAULT '#2563eb',
	`description` text NOT NULL,
	`juryNames` text NOT NULL,
	`isSeasonal` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contests_id` PRIMARY KEY(`id`),
	CONSTRAINT `contests_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `payment_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int,
	`orderId` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`clientEmail` varchar(255) NOT NULL,
	`clientPhone` varchar(60),
	`serviceName` varchar(255) NOT NULL,
	`status` enum('created','paid','failed','cancelled') NOT NULL DEFAULT 'created',
	`paykeeperId` varchar(120),
	`payUrl` text,
	`callbackPayload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_transactions_orderId_unique` UNIQUE(`orderId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
