const UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

// Parses simple duration strings used in JWT_*_EXPIRES_IN env vars (e.g.
// "15m", "7d") into a future Date, so we can persist RefreshToken.expiresAt.
export function durationFromNow(duration: string): Date {
  const match = /^(\d+)(s|m|h|d)$/.exec(duration.trim());
  if (!match) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }
  const [, amount, unit] = match;
  return new Date(Date.now() + Number(amount) * UNIT_MS[unit]);
}
