CREATE TABLE IF NOT EXISTS `citizen_tips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`province` text DEFAULT '' NOT NULL,
	`place` text DEFAULT '' NOT NULL,
	`description` text NOT NULL,
	`media_keys` text DEFAULT '[]' NOT NULL,
	`allow_credit` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`ip_address` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
