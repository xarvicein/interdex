import type { Request, Response } from "express";
import type { AuthResponse } from "@interdex/shared";
import { asyncHandler } from "../../utils/asyncHandler";
import { toUserDTO } from "../../utils/mappers";
import { HttpError } from "../../utils/httpError";
import { env } from "../../config/env";
import {
  loginLocalUser,
  registerLocalUser,
  revokeRefreshToken,
  rotateRefreshToken,
} from "./auth.service";

const REFRESH_COOKIE = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
};

function sendAuthResponse(
  res: Response,
  user: Parameters<typeof toUserDTO>[0],
  accessToken: string,
  refreshToken: string,
) {
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  const body: AuthResponse = { user: toUserDTO(user), accessToken };
  res.json(body);
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const { user, accessToken, refreshToken } = await registerLocalUser(
    email,
    password,
    name,
  );
  sendAuthResponse(res, user, accessToken, refreshToken);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginLocalUser(
    email,
    password,
  );
  sendAuthResponse(res, user, accessToken, refreshToken);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw HttpError.unauthorized("Missing refresh token");
  const { user, accessToken, refreshToken } = await rotateRefreshToken(token);
  sendAuthResponse(res, user, accessToken, refreshToken);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) await revokeRefreshToken(token);
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
  res.status(204).send();
});

// After passport's verify callback runs, req.user holds { id, role,
// accessToken, refreshToken }. Set the refresh cookie and hand the access
// token to the frontend via a redirect fragment (never in the URL query,
// which would land in server logs).
export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const authUser = req.user;
    if (!authUser?.accessToken || !authUser?.refreshToken) {
      throw HttpError.unauthorized("Google authentication failed");
    }
    res.cookie(REFRESH_COOKIE, authUser.refreshToken, refreshCookieOptions);
    const redirectUrl = new URL("/auth/callback", env.FRONTEND_URL);
    redirectUrl.hash = `accessToken=${encodeURIComponent(authUser.accessToken)}`;
    res.redirect(redirectUrl.toString());
  },
);
