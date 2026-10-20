import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const AUTH_COOKIE = "school_sport_hub_auth";
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"];

export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function getJwtSecret(): string {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return JWT_SECRET;
}

export function createAccessToken(user: AuthUser): string {
  return jwt.sign(
    { sub: String(user.id), email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRES_IN },
  );
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.cookie;
  if (!header) return undefined;

  const value = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return value ? decodeURIComponent(value.slice(name.length + 1)) : undefined;
}

export function setAuthCookie(response: Response, token: string): void {
  const days = Number(process.env.AUTH_COOKIE_DAYS ?? 7);
  const maxAge = Number.isFinite(days) && days > 0 ? Math.floor(days * 24 * 60 * 60) : 604800;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const decoded = jwt.decode(token);
  const tokenAge = decoded && typeof decoded === "object" && decoded.exp ? Math.max(0, decoded.exp - Math.floor(Date.now() / 1000)) : maxAge;
  response.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=${encodeURIComponent(token)}; Max-Age=${Math.min(maxAge, tokenAge)}; Path=/; HttpOnly; SameSite=Lax${secure}`,
  );
}

export function clearAuthCookie(response: Response): void {
  response.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`,
  );
}

export const requireAuth: RequestHandler = async (request, response, next) => {
  try {
    const token = readCookie(request, AUTH_COOKIE);
    if (!token) {
      response.status(401).json({ error: "Authentication required" });
      return;
    }

    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      response.status(401).json({ error: "Invalid authentication token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      response.status(401).json({ error: "Account is inactive or unavailable" });
      return;
    }

    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    // Renew a valid session while the user is actively using the workspace.
    setAuthCookie(response, createAccessToken(request.user));
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof Error && error.message.includes("JWT_SECRET")) {
      response.status(401).json({ error: "Invalid authentication token" });
      return;
    }
    next(error);
  }
};

export function requireRole(...roles: string[]): RequestHandler {
  return (request, response, next) => {
    if (!request.user) {
      response.status(401).json({ error: "Authentication required" });
      return;
    }
    if (!roles.includes(request.user.role)) {
      response.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
