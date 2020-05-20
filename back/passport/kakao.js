const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const db = require("../models");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECERET,
        callbackURL: "http://localhost:3003/api/user/auth/kakao/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            where: {
              OAuthID: profile._json.id,
              provider: "kakao",
            },
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await db.User.create({
            userId: profile._json && profile._json.id,
            nickname: profile.displayName,
            OAuthID: profile._json && profile._json.id,
            // profilePhoto: profile._json && profile._json.profile_image,
            // thumbnail_image: profile._json && profile._json.thumbnail_image,
            provider: "kakao",
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
