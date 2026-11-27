CREATE TABLE IF NOT EXISTS `video_reels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`shortcode` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`cover_url` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `video_reels_shortcode_unique` ON `video_reels` (`shortcode`);