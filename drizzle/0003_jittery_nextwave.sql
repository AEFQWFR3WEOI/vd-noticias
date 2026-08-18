CREATE TABLE IF NOT EXISTS `broadcast_channels` (
	`id` integer PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`always_on` integer DEFAULT true NOT NULL,
	`is_live` integer DEFAULT false NOT NULL,
	`source_mode` text DEFAULT 'automatic' NOT NULL,
	`provider` text DEFAULT 'cloudflare' NOT NULL,
	`primary_url` text DEFAULT '' NOT NULL,
	`backup_url` text DEFAULT '' NOT NULL,
	`continuity_url` text DEFAULT '' NOT NULL,
	`title` text DEFAULT 'Visión Dominicana TV en vivo' NOT NULL,
	`description` text DEFAULT 'Noticias, entrevistas y cobertura especial desde República Dominicana.' NOT NULL,
	`poster_url` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `editorial_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `editorial_sessions_token_hash_unique` ON `editorial_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `editorial_sessions_user_id_idx` ON `editorial_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `editorial_sessions_expires_at_idx` ON `editorial_sessions` (`expires_at`);--> statement-breakpoint
ALTER TABLE `editorial_users` ADD `password_hash` text;
