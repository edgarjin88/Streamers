const passport = require("passport");
const db = require("../models");
const local = require("./local");
const google = require("./google");
const facebook = require("./facebook");
const instagram = require("./instagram");
const kakao = require("./kakao");
const linkedIn = require("./linkedIn");
// const twitter = require("./twitter");

const user = {};
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("serializeUser fired");

    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserializeUser fired");
    if (user[id]) {
      try {
        return done(user[id]);
      } catch (e) {
        return done(e);
      }
    } else {
      try {
        const user = await db.User.findOne({
          where: { id },
          include: [
            {
              model: db.Video,
              as: "Videos",
              attributes: ["id"],
            },
            {
              model: db.User,
              as: "Followings",
              attributes: ["id"],
            },
            {
              model: db.User,
              as: "Followers",
              attributes: ["id"],
            },
          ],
        });
        return done(null, user);
      } catch (e) {
        // console.error(e);
        return done(e);
      }
    }
  });

  local();
  google();
  facebook();
  instagram();
  kakao();
  linkedIn();
};

//deserialize to be cached
//no argument required first, and then (userId, password, done)
