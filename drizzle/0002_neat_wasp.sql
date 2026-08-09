CREATE TABLE `broadcast_programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`kind` text DEFAULT 'program' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`presenter` text DEFAULT '' NOT NULL,
	`cover_image_url` text DEFAULT '' NOT NULL,
	`schedule_day` text DEFAULT 'Próximamente' NOT NULL,
	`schedule_time` text DEFAULT '' NOT NULL,
	`destination_url` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `broadcast_programs_slug_unique` ON `broadcast_programs` (`slug`);--> statement-breakpoint
CREATE TABLE `broadcast_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`is_live` integer DEFAULT false NOT NULL,
	`stream_url` text DEFAULT '' NOT NULL,
	`title` text DEFAULT 'Visión Dominicana TV en vivo' NOT NULL,
	`description` text DEFAULT 'Noticias, entrevistas y cobertura especial desde República Dominicana.' NOT NULL,
	`poster_url` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
