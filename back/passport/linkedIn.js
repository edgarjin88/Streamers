const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const db = require("../models");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECERET,
        callbackURL: "http://localhost:3003/api/user/auth/linkedin/callback",
        // scope: ["r_emailaddress", "r_basicprofile"],
        // state: true
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            where: {
              OAuthID: profile.id,
              provider: "linkedIn",
            },
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await db.User.create({
            userId: profile.id,
            nickname: profile.displayName,
            OAuthID: profile.id,
            // profilePhoto:
            //   (profile &&
            //     profile.photos &&
            //     profile.photos[3] &&
            //     profile.photos[3].value) ||
            //   null,
            provider: "linkedIn",
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
