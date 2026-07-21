import rateLimit from "express-rate-limit";

// Applied to /auth/login, /auth/register, /auth/refresh to slow down
// credential-stuffing / brute-force attempts.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});
