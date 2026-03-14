CREATE TABLE `simulation_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`businessType` varchar(64) NOT NULL,
	`adminStaff` int NOT NULL,
	`hoursPerWeek` float NOT NULL,
	`loadedHourlyRate` float NOT NULL,
	`annualSavings` float NOT NULL,
	`hoursFreedPerYear` float NOT NULL,
	`roiPercent` float NOT NULL,
	`ownerEmail` varchar(320),
	`ownerName` varchar(128),
	`businessName` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `simulation_results_id` PRIMARY KEY(`id`),
	CONSTRAINT `simulation_results_token_unique` UNIQUE(`token`)
);
