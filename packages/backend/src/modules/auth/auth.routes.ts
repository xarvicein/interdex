import { Router } from "express";
import { passport } from "./passport";
import { validate } from "../../middleware/validate";
import { authRateLimiter } from "../../middleware/rateLimit";
import { authenticate } from "../../middleware/auth";
import { registerSchema, loginSchema } from "./auth.validation";
import * as authController from "./auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { toUserDTO } from "../../utils/mappers";
import { prisma } from "../../db/prisma";
import { HttpError } from "../../utils/httpError";
import { isGoogleSsoConfigured } from "../../config/env";

export const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  validate({ body: registerSchema }),
  authController.register,
);
authRouter.post(
  "/login",
  authRateLimiter,
  validate({ body: loginSchema }),
  authController.login,
);
authRouter.post("/refresh", authRateLimiter, authController.refresh);
authRouter.post("/logout", authController.logout);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw HttpError.notFound("User not found");
    res.json({ user: toUserDTO(user) });
  }),
);

if (isGoogleSsoConfigured) {
  authRouter.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    }),
  );
  authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    authController.googleCallback,
  );
}

authRouter.get("/google/status", (_req, res) => {
  res.json({ enabled: isGoogleSsoConfigured });
});
