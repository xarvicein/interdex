import type { NextFunction, Request, Response } from "express";
import { Role } from "@interdex/shared";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "../utils/httpError";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // @types/passport declares `Request.user?: Express.User` (an empty
    // interface meant to be augmented) — extend it here instead of
    // redeclaring Request.user, which would conflict with passport's types.
    interface User {
      id: string;
      role: Role;
      // Populated only by the Google OAuth verify callback so the
      // /auth/google/callback route can read freshly issued tokens off
      // req.user without a second DB round trip.
      accessToken?: string;
      refreshToken?: string;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(HttpError.unauthorized("Missing access token"));
  }
  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(HttpError.unauthorized("Invalid or expired access token"));
  }
}

// Like authenticate, but doesn't fail the request when no/invalid token is
// present — used on public routes that personalize output for logged-in users.
export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const payload = verifyAccessToken(header.slice("Bearer ".length));
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // ignore invalid token on optional routes
    }
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(HttpError.unauthorized());
    if (!roles.includes(req.user.role)) return next(HttpError.forbidden());
    next();
  };
}

export const requireAdmin = requireRole(Role.ADMIN);
