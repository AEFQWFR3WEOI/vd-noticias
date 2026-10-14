import vinext from "vinext";
import { defineConfig } from "vite";

const SITE_CREATOR_DATABASE_ID =
  "1d5cbe6a-a294-473a-a0a4-305725fc0623";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: [
    {
      binding: "DB",
      database_name: "site-creator-d1",
      database_id: SITE_CREATOR_DATABASE_ID,
    },
  ],
  r2_buckets: [
    {
      binding: "BUCKET",
      bucket_name: "site-creator-r2",
    },
  ],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    build: {
      // Preserve legacy max-width media queries for older iPhones and mobile
      // webviews instead of emitting Safari 16.4-only range syntax.
      target: "safari13" as const,
      cssTarget: "safari13" as const,
      cssMinify: "esbuild" as const,
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: localBindingConfig,
      }),
    ],
  };
});
