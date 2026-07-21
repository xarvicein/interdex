import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env, isGoogleSsoConfigured } from "../../config/env";
import { findOrCreateGoogleUser } from "./auth.service";

if (isGoogleSsoConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Google account has no email"));
        }
        findOrCreateGoogleUser({
          googleId: profile.id,
          email,
          name: profile.displayName || email,
          avatarUrl: profile.photos?.[0]?.value,
        })
          .then((result) =>
            done(null, {
              id: result.user.id,
              role: result.user.role,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            }),
          )
          .catch(done);
      },
    ),
  );
} else {
  console.warn(
    "[auth] Google SSO is not configured — set GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL to enable it.",
  );
}

export { passport };
