CREATE TABLE `ad_campaigns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`placement_code` text NOT NULL,
	`creative_media_id` integer,
	`destination_url` text,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`status` text DEFAULT 'proposal' NOT NULL,
	`impressions` integer DEFAULT 0 NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ad_placements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`dimensions` text NOT NULL,
	`location` text NOT NULL,
	`base_rate` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ad_placements_code_unique` ON `ad_placements` (`code`);--> statement-breakpoint
CREATE TABLE `advertiser_leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`objective` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `article_revisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`editor_email` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`status` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`category_slug` text NOT NULL,
	`author_email` text NOT NULL,
	`hero_image_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_breaking` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `editorial_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text DEFAULT 'journalist' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `editorial_users_email_unique` ON `editorial_users` (`email`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`object_key` text NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`alt_text` text DEFAULT '' NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_assets_object_key_unique` ON `media_assets` (`object_key`);--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);