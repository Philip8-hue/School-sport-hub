import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const [emailInput, password, nameInput] = process.argv.slice(2);
const parsed = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
  name: z.string().trim().min(1).max(80).optional(),
}).safeParse({ email: emailInput, password, name: nameInput });

async function main(): Promise<void> {
  if (!parsed.success) {
    console.error("Usage: npm run admin:create -- admin@example.com 'a-strong-password-at-least-12-chars' 'Admin Name'");
    console.error("The password must be between 12 and 128 characters.");
    process.exitCode = 1;
    return;
  }

  const { email, password: rawPassword, name } = parsed.data;
  const passwordHash = await bcrypt.hash(rawPassword, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: name || undefined, passwordHash, role: "ADMIN", isActive: true, sessionVersion: { increment: 1 }, legacySessionsUntil: null, mfaRequiredAfter: new Date(Date.now()+14*86400000) },
    create: { email, name: name || null, passwordHash, role: "ADMIN", isActive: true, mfaRequiredAfter: new Date(Date.now()+14*86400000) },
    select: { id: true, email: true, name: true, role: true },
  });
  console.log(`Admin account ready: ${user.email}`);
}

main().catch((error) => {
  console.error("Unable to create admin account", { code: (error as {code?:string}).code || "INTERNAL_ERROR" });
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
