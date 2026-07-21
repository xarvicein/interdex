import { AuthProvider, Role } from "@interdex/shared";
import { prisma } from "../../db/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../../utils/jwt";
import { durationFromNow } from "../../utils/duration";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";
import type { User } from "@prisma/client";

async function issueTokenPair(user: User) {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: durationFromNow(env.JWT_REFRESH_EXPIRES_IN),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerLocalUser(
  email: string,
  password: string,
  name: string,
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    throw HttpError.conflict("An account with that email already exists");

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      authProvider: AuthProvider.LOCAL,
      role: Role.USER,
    },
  });

  return { user, ...(await issueTokenPair(user)) };
}

export async function loginLocalUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw HttpError.unauthorized("Invalid email or password");
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw HttpError.unauthorized("Invalid email or password");

  return { user, ...(await issueTokenPair(user)) };
}

export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}) {
  let user = await prisma.user.findUnique({
    where: { googleId: profile.googleId },
  });

  if (!user) {
    // Link to an existing local account with the same email if present.
    user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId, authProvider: AuthProvider.GOOGLE },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          googleId: profile.googleId,
          authProvider: AuthProvider.GOOGLE,
          role: Role.USER,
        },
      });
    }
  }

  return { user, ...(await issueTokenPair(user)) };
}

export async function rotateRefreshToken(refreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw HttpError.unauthorized("Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (
    !stored ||
    stored.revokedAt ||
    stored.expiresAt < new Date() ||
    stored.userId !== payload.sub
  ) {
    throw HttpError.unauthorized("Refresh token is no longer valid");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw HttpError.unauthorized("Account no longer exists");

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return { user, ...(await issueTokenPair(user)) };
}

export async function revokeRefreshToken(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
