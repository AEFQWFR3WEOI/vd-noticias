CREATE TABLE `broadcast_channels` (
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
