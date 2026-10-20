import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import {
  clearAuthCookie,
  createAccessToken,
  requireAuth,
  setAuthCookie,
} from "../middleware/auth.js";

type AuthRouterOptions = {
  prisma: PrismaClient;
};

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(1).max(80).optional(),
});

function publicUser(user: { id: number; email: string; name: string | null; role: string }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export function createAuthRouter({ prisma }: AuthRouterOptions): Router {
  const router = Router();

  router.post("/register", async (request, response, next) => {
    if (process.env.ALLOW_PUBLIC_REGISTRATION !== "true") {
      response.status(403).json({ error: "Public registration is disabled" });
      return;
    }

    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Invalid registration details", details: parsed.error.flatten() });
      return;
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (existing) {
        response.status(409).json({ error: "Unable to register with those details" });
        return;
      }

      const user = await prisma.user.create({
        data: {
          email: parsed.data.email,
          name: parsed.data.name || null,
          passwordHash: await bcrypt.hash(parsed.data.password, 12),
          role: "USER",
          isActive: true,
        },
        select: { id: true, email: true, name: true, role: true },
      });

      setAuthCookie(response, createAccessToken(publicUser(user)));
      response.status(201).json({ user: publicUser(user) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (request, response, next) => {
    const parsed = credentialsSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Invalid email or password" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
      const valid = user?.passwordHash
        ? await bcrypt.compare(parsed.data.password, user.passwordHash)
        : false;

      if (!user || !user.isActive || !valid) {
        response.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const safeUser = publicUser(user);
      setAuthCookie(response, createAccessToken(safeUser));
      response.status(200).json({ user: safeUser });
    } catch (error) {
      next(error);
    }
  });

  router.get("/me", requireAuth, (request, response) => {
    response.status(200).json({ user: request.user });
  });

  router.post("/logout", (_request, response) => {
    clearAuthCookie(response);
    response.status(204).send();
  });

  return router;
}
