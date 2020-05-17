const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../models");
const { isLoggedIn } = require("./middleware");

const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

const expressJWT = require("express-jwt");
const _ = require("lodash");

require("dotenv").config();

const router = express.Router();

const { socketList } = require("../socket/socket");

console.log("socket list imported :", socketList);
const {
  accountActivation,
  signup,
  passwordReset,
  passwordChange,
  confirmPasswordReset,
} = require("../controllers/auth");

router.get("/", isLoggedIn, (req, res) => {
  // const io = req.app.get("io");

  const user = Object.assign({}, req.user.toJSON());

  console.log("user info: "), user;
  delete user.password;
  return res.json(user);
});

router.post("/", signup);
router.post("/account-activation", accountActivation);
router.post("/passwordreset", passwordReset);

const { imageLink, upload } = require("../utilities/multerOptions");

router.post(
  "/profile",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    try {
      await db.User.update(
        {
          profilePhoto: req.file[imageLink],
        },
        {
          where: { id: req.user.id },
        }
      );
      res.send(req.file[imageLink]);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10),
      },

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
      attributes: ["id", "nickname", "profilePhoto", "userId", "description"],
    });
    const jsonUser = user.toJSON();
    jsonUser.Videos = jsonUser.Videos ? jsonUser.Videos.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/logout", (req, res) => {
  // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send("LOGOUT Success");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: {
            id: user.id,
          },
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
          attributes: [
            "id",
            "nickname",
            "userId",
            "profilePhoto",
            "notification",
          ],
        });

        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});

router.get("/:id/followings", isLoggedIn, async (req, res, next) => {
  // /api/user/:id/followings
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followers = await user.getFollowings({
      //cached user
      attributes: ["id", "nickname", "profilePhoto"],
      limit: parseInt(req.query.limit, 10), //limit, offset are sequalize attributes
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/:id/followers", isLoggedIn, async (req, res, next) => {
  // /api/user/:id/followers (reall address)
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        //0 to prevent undefined. In sequelize, undefined can make errors.
      }, //
    }); // req.params.id '0'
    const followers = await user.getFollowers({
      //getFollowers options
      attributes: ["id", "nickname", "profilePhoto"],
      limit: parseInt(req.query.limit, 10), //req.param.id === strings
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e); //error send error to front
  }
});

router.delete("/:id/follower", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      //req.user.id=== my id, //req.params.id others' id
      where: {
        id: req.user.id,
      },
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const me = await db.User.findOne({
      //req.user.id. cache user first to prevent unexpected errors.
      where: {
        id: req.user.id,
      },
    });
    await me.addFollowing(req.params.id);

    const targetUser = await db.User.findOne({
      where: {
        id: targetUserId,
      },
    });
    await targetUser.update({ notification: targetUser.notification + 1 });

    const event = await db.Event.create({
      content: `${me.nickname} subscribed your Streaming Channels.`,
      UserId: req.user.id,
      userProfile: req.user.profilePhoto,
      TargetUserId: targetUserId,
    });

    const io = req.app.get("io");

    const targetSocket = socketList[targetUserId];

    if (targetSocket) {
      io.to(targetSocket).emit("eventSentFromServer", {
        message: event.content,
        icon: me.profilePhoto,
        profileLink: me.id,
      });
    }

    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const me = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await me.removeFollowing(req.params.id);

    const targetUser = await db.User.findOne({
      where: {
        id: targetUserId,
      },
    });

    await targetUser.update({ notification: targetUser.notification + 1 });

    const event = await db.Event.create({
      content: `${me.nickname} unsubscribed your Streaming Channels.`,
      UserId: req.user.id,
      userProfile: req.user.profilePhoto,
      TargetUserId: targetUserId,
    });
    const io = req.app.get("io");

    const targetSocket = socketList[targetUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("eventSentFromServer", {
        message: event.content,
        icon: me.profilePhoto,
        profileLink: me.id,
      });
    }

    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/:id/videos", async (req, res, next) => {
  try {
    const vidoes = await db.Video.findAll({
      where: {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0, //if "0", still send information.
        RetweetId: null, // If it is my post, retweetId is null.
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id", "profilePhoto"],
        },
      ],
    });
    res.json(vidoes);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  //partial update, isLoggedIn to be checked
  try {
    await db.User.update(
      {
        //partial update
        nickname: req.body.nickname, // req.body
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch("/password", isLoggedIn, passwordChange);
router.patch("/confirm-password-reset", confirmPasswordReset);

router.patch("/description", isLoggedIn, async (req, res, next) => {
  try {
    const exUser = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!exUser) {
      return res
        .status(400)
        .send("Error occured while editing description. Please try again");
    }

    await exUser.update({
      description: req.body.description,
    });
    return res.status(200).send(req.body.description);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/http://localhost:3000/signin",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/signin");
  }
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/http://localhost:3000/signin",
  }),
  (req, res) => {
    // socketList[req.user.id] = req.session.socketId;

    res.redirect("http://localhost:3000/signin");
  }
);
router.get(
  "/auth/instagram",
  passport.authenticate("instagram", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", {
    failureRedirect: "http://localhost:3000/signin",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/signin");
  }
);

router.get(
  "/auth/kakao",
  passport.authenticate("kakao", {
    failureRedirect: "http://localhost:3000/signin",
  })
);

router.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "http://localhost:3000/signin",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", {
    failureRedirect: "http://localhost:3000/signin",
  })
);

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: "http://localhost:3000/signin",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/signin");
  }
);

router.delete("/deletenotifications", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await me.update({ notification: 0 });
    const allNotifications = await db.Event.findAll({
      where: {
        TargetUserId: req.user.id,
      },
    });
    console.log("allNotifications :", allNotifications);
    res.send(allNotifications);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete(
  "/deletesinglenotification/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const notification = await db.Event.findOne({
        where: { id: req.params.id },
      });
      if (!notification) {
        return res.status(404).send("notification does not exist.");
      }
      await db.Event.destroy({ where: { id: req.params.id } });

      res.send(req.params.id);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);
module.exports = router;
