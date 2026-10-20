import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as SupabaseClient } from "../../../generated/supabase/client.js";

function createClient(): PrismaClient {
  if (process.env.DATABASE_PROVIDER && !["sqlite", "supabase"].includes(process.env.DATABASE_PROVIDER)) {
    throw new Error("DATABASE_PROVIDER must be sqlite or supabase");
  }
  if (process.env.DATABASE_PROVIDER === "supabase") {
    const connectionString = process.env.SUPABASE_DATABASE_URL;
    if (!connectionString) throw new Error("SUPABASE_DATABASE_URL is required when DATABASE_PROVIDER=supabase");
    const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 15000, max: 5 });
    // Both clients are generated from the same models; only the database provider differs.
    return new SupabaseClient({ adapter }) as unknown as PrismaClient;
  }
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
  return new PrismaClient({ adapter });
}

export const prisma = createClient();
