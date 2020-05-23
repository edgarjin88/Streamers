const express = require("express");
const { isLoggedIn } = require("./middleware");
const router = express.Router();
const { imageLink, upload } = require("../utilities/multerOptions");
const {
  createVideo,
  updateVideo,
  getVideo,
  deleteVideo,
  getComments,
  deleteComment,
  writeComment,
  dislikeVideo,
  removeDislikeVideo,
  likeVideo,
  removeLikeVideo,
  likeComment,
  removeLikeComment,
  writeRecomment,
  removeRecomment,
  dislikeComment,
  removeDislikeComment,
} = require("../controllers/video");

router.patch("/:id", isLoggedIn, updateVideo);
router.get("/:id", getVideo);
router.delete("/:id", isLoggedIn, deleteVideo);
router.get("/:id/comments", getComments);
router.delete("/:id/comment", isLoggedIn, deleteComment);
router.post("/:id/comment", isLoggedIn, writeComment);
router.post("/:id/dislike", isLoggedIn, dislikeVideo);
router.delete("/:id/dislike", isLoggedIn, removeDislikeVideo);
router.post("/:id/like", isLoggedIn, likeVideo);
router.delete("/:id/like", isLoggedIn, removeLikeVideo);
router.post("/:id/commentlike", isLoggedIn, likeComment);
router.delete("/:id/commentlike", isLoggedIn, removeLikeComment);
router.post("/:id/recomment", isLoggedIn, writeRecomment);
router.delete("/:id/recomment/:recommentId", isLoggedIn, removeRecomment);
router.post("/:id/commentDislike", isLoggedIn, dislikeComment);
router.delete("/:id/commentDislike", isLoggedIn, removeDislikeComment);
router.post("/", isLoggedIn, upload.none(), createVideo);
router.post("/image", isLoggedIn, upload.array("image"), (req, res) => {
  res.json(
    req.files.map((v) => {
      return v[imageLink];
    })
  );
});

module.exports = router;
