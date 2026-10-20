import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/supabase/schema.prisma",
  migrations: { path: "prisma/supabase/migrations" },
  datasource: { url: env("SUPABASE_DATABASE_URL") },
});
