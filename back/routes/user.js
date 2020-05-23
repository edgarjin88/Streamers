const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("./middleware");

require("dotenv").config();

const router = express.Router();

const {
  accountActivation,
  signup,
  passwordReset,
  passwordChange,
  confirmPasswordReset,
  logOut,
  logIn,
} = require("../controllers/auth");

const { upload } = require("../utilities/multerOptions");

const {
  getMyInfo,
  updateProfile,
  getUserInfo,
  getFollowings,
  getFollowers,
  deleteFollower,
  follow,
  deleteFollow,
  getUserVideos,
  getFavoriteVideos,
  changeNickname,
  changeDescription,
} = require("../controllers/user");

const {
  deleteNotification,
  deleteSingleNotification,
} = require("../controllers/notification");

//auth
router.post("/", signup);
router.post("/account-activation", accountActivation);
router.post("/passwordreset", passwordReset);
router.get("/", isLoggedIn, getMyInfo);
router.post("/profile", isLoggedIn, upload.single("image"), updateProfile);
router.get("/:id", getUserInfo);
router.post("/logout", logOut);
router.post("/login", logIn);

//subscribe
router.get("/:id/followings", isLoggedIn, getFollowings);
router.get("/:id/followers", isLoggedIn, getFollowers);
router.delete("/:id/follower", isLoggedIn, deleteFollower);
router.post("/:id/follow", isLoggedIn, follow);
router.delete("/:id/follow", isLoggedIn, deleteFollow);

//personal info
router.patch("/password", isLoggedIn, passwordChange);
router.patch("/confirm-password-reset", confirmPasswordReset);
router.patch("/nickname", isLoggedIn, changeNickname);
router.patch("/description", isLoggedIn, changeDescription);

//user videos
router.get("/:id/favorite", getFavoriteVideos);
router.get("/:id/videos", getUserVideos);

//notification
router.delete("/deletenotifications", isLoggedIn, deleteNotification);
router.delete(
  "/deletesinglenotification/:id",
  isLoggedIn,
  deleteSingleNotification
);

//Oauth
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

module.exports = router;
