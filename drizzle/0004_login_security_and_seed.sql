CREATE TABLE IF NOT EXISTS `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `login_attempts_email_idx` ON `login_attempts` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `login_attempts_ip_idx` ON `login_attempts` (`ip_address`,`created_at`);--> statement-breakpoint
-- Datos iniciales: secciones del periódico (las mismas del editor de artículos).
INSERT OR IGNORE INTO `categories` (`name`, `slug`, `description`, `position`) VALUES
	('Nacionales', 'nacionales', 'Lo que pasa en República Dominicana', 1),
	('Política', 'politica', 'Gobierno, partidos y Congreso', 2),
	('Economía', 'economia', 'Mercados, empleo y negocios', 3),
	('Mundo', 'mundo', 'Noticias internacionales', 4),
	('Deportes', 'deportes', 'Béisbol, baloncesto y más', 5),
	('Revista', 'revista', 'Historias y estilo de vida', 6),
	('Entretenimiento', 'entretenimiento', 'Música, cine y farándula', 7),
	('Tecnología', 'tecnologia', 'Innovación y vida digital', 8),
	('Salud', 'salud', 'Salud pública y bienestar', 9),
	('Educación', 'educacion', 'Escuelas, universidades y formación', 10),
	('Turismo', 'turismo', 'Destinos y sector turístico', 11),
	('Cultura', 'cultura', 'Arte, letras y tradición', 12),
	('Opinión', 'opinion', 'Columnas y análisis', 13),
	('Planeta', 'planeta', 'Medio ambiente y clima', 14),
	('Videos', 'videos', 'Lo mejor de Visión Dominicana TV', 15);
--> statement-breakpoint
-- Datos iniciales: espacios publicitarios (los mismos del formulario de campañas).
-- La tarifa base (en RD$) se ajusta luego desde la base de datos.
INSERT OR IGNORE INTO `ad_placements` (`code`, `name`, `dimensions`, `location`, `base_rate`, `active`) VALUES
	('homepage-top', 'Impacto principal', '970x90', 'Portada, parte superior', 0, 1),
	('homepage-middle', 'Portada premium', '728x90', 'Portada, zona central', 0, 1),
	('article-inline', 'Dentro de noticia', '728x90', 'Cuerpo de cada noticia', 0, 1),
	('sidebar-300x600', 'Robapágina', '300x600', 'Columna lateral', 0, 1),
	('branded-content', 'Especial de marca', 'Contenido', 'Artículo patrocinado', 0, 1);
--> statement-breakpoint
-- Fila única de configuración del canal en vivo.
INSERT OR IGNORE INTO `broadcast_channels` (`id`) VALUES (1);
--> statement-breakpoint
INSERT OR IGNORE INTO `broadcast_settings` (`id`) VALUES (1);
