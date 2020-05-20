const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const db = require("../models");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECERET,
        callbackURL: "http://localhost:3003/api/user/auth/google/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            where: {
              OAuthID: profile.id,
              provider: "google",
            },
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await db.User.create({
            userId: profile._json && profile._json.email,
            nickname: profile.displayName,
            OAuthID: profile.id,
            // profilePhoto: profile._json && profile._json.picture,
            provider: "google",
          });
          return done(null, newUser);
        } catch (error) {
          console.error("error fired :", error);
          done(error);
        }
      }
    )
  );
};
