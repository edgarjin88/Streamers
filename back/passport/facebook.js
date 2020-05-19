const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const db = require("../models");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECERET,
        callbackURL: "http://localhost:3003/api/user/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            where: {
              OAuthID: profile.id,
              provider: "facebook",
            },
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await db.User.create({
            userId: profile._json && profile._json.email,
            nickname: profile.displayName,
            OAuthID: profile.id,
            profilePhoto: profile._json && profile.photos[0].value,
            provider: "facebook",
          });
          console.log("new user from facebook: ", newUser);
          return done(null, newUser);
        } catch (error) {
          console.error("error fired :", error);
          done(error);
        }
      }
    )
  );
};
