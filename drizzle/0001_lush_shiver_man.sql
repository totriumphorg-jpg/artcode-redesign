ALTER TABLE `applications` MODIFY COLUMN `paymentAmount` int NOT NULL DEFAULT 1700;--> statement-breakpoint
ALTER TABLE `contests` MODIFY COLUMN `feeAmount` int NOT NULL DEFAULT 1700;