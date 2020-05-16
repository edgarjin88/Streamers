const express = require("express");

const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

const { imageLink, upload } = require("../utilities/multerOptions");
const { socketList } = require("../socket/socket");

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.description.match(/#[^\s]+/g);
    const newVideo = await db.Video.create({
      title: req.body.title,
      description: req.body.description,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );
      // console.log(result);
      await newVideo.addHashtags(result.map((r) => r[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          //wait for all record on DB
          req.body.image.map((image) => {
            return db.Image.create({ src: image });
          })
        );
        await newVideo.addImages(images);
      } else {
        //for one image, image: address 1.
        const image = await db.Image.create({ src: req.body.image });

        await newVideo.addImage(image);
      }
    }

    const fullVideo = await db.Video.findOne({
      where: { id: newVideo.id },
      include: [
        {
          model: db.User,
        },
        {
          model: db.Image,
        },
      ],
    });
    res.json(fullVideo);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/image", upload.array("image"), (req, res) => {
  res.json(
    req.files.map((v) => {
      // console.log("each v :", v);
      // console.log("each v[imageLink] :", v[imageLink]);
      return v[imageLink];
    })
  );
});

///////

router.patch("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const exVideo = await db.Video.findOne({
      where: { id: req.params.id },
    });

    if (!exVideo) {
      return res.status(404).send("video does not exist.");
    }
    const images = await db.Image.findAll({
      where: { VideoId: exVideo.id },
    });

    // console.log("image liset: ", images);
    await exVideo.removeImages(images);

    const hashtags = req.body.description.match(/#[^\s]+/g);
    // console.log("form in body :", req.body);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );
      await exVideo.addHashtags(result.map((r) => r[0]));
    }

    await exVideo.update({
      description: req.body.description,
      title: req.body.title,
    });

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => {
            return db.Image.create({ src: image });
          })
        );
        await exVideo.addImages(images);
      } else {
        const image = await db.Image.create({ src: req.body.image });

        await exVideo.addImage(image);
      }
    }

    const video = await db.Video.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.Image,
        },
      ],
    });

    res.send(video);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//////
router.get("/:id", async (req, res, next) => {
  try {
    const video = await db.Video.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"],
          include: [
            {
              model: db.User,
              through: "Follow",
              as: "Followers",
              attributes: ["id"],
            },
          ],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.User,
          through: "Dislike",
          as: "Dislikers",
          attributes: ["id"],
        },
      ],
    });

    await video.update({ viewCount: video.viewCount + 1 });
    res.json(video);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await db.Video.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }

    // nested: true;
    const comments = await db.Comment.findAll({
      where: {
        VideoId: req.params.id,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.Comment,
          as: "Recomment",
          attributes: ["id", "content", "createdAt"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.User,
              as: "Recommenter",
              attributes: ["id", "nickname", "profilePhoto"],
            },
            {
              model: db.User,
              through: "CommentLike",
              as: "CommentLikers",
              attributes: ["id", "nickname", "profilePhoto"],
            },
            {
              model: db.User,
              through: "CommentDislike",
              as: "CommentDislikers",
              attributes: ["id", "nickname", "profilePhoto"],
            },
          ],
        },
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.User,
          through: "CommentLike",
          as: "CommentLikers",
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.User,
          through: "CommentDislike",
          as: "CommentDislikers",
          attributes: ["id", "nickname", "profilePhoto"],
        },
      ],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/comment", isLoggedIn, async (req, res, next) => {
  try {
    // if(req.body.refComment)
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Comment does not exist.");
    }
    await db.Comment.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  // POST /api/post/1000000/comment  /// !== comments
  try {
    //for comment to a video
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    const newComment = await db.Comment.create({
      VideoId: video.id,
      UserId: req.user.id,
      content: req.body.content,
    });

    await video.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: db.Comment,
          as: "Recomment",
          attributes: ["id", "content", "createdAt"],
        },
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.User,
          through: "CommentLike",
          as: "CommentLikers",
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.User,
          through: "CommentDislike",
          as: "CommentDislikers",
          attributes: ["id", "nickname", "profilePhoto"],
        },
      ],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post("/:id/dislike", isLoggedIn, async (req, res, next) => {
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await video.addDisliker(req.user.id);
    res.json({
      userId: req.user.id,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/dislike", isLoggedIn, async (req, res, next) => {
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await video.removeDisliker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await db.Video.findOne({ where: { id: videoId } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await video.addLiker(req.user.id);

    const liker = await db.User.findOne({ where: { id: req.user.id } });
    const targetUser = await db.User.findOne({ where: { id: video.UserId } });
    await targetUser.update({ notification: targetUser.notification + 1 });
    console.log("this is user :", req.user);
    const event = await db.Event.create({
      content: `${liker.nickname} liked your Streaming Channel: ${video.title}.`,
      targetVideoId: videoId,
      UserId: req.user.id,
      userProfile: req.user.profilePhoto,
      TargetUserId: video.UserId,
    });

    // io.to(socketId).emit("hey", "I just met you");
    const io = req.app.get("io");

    const targetSocket = socketList[video.UserId];
    console.log("this is io :", io);

    if (targetSocket) {
      console.log("targetSocket2 :", targetSocket);

      io.to(targetSocket).emit("eventSentFromServer", {
        message: event.content,
        videoId: videoId,
        icon: liker.profilePhoto,
      });
    }

    res.json({
      userId: req.user.id,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await video.removeLiker(req.user.id);

    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
///comment like
///comment like
router.post("/:id/commentlike", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Comment does not exist.");
    }
    await comment.addCommentLiker(req.user.id);

    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "nickname", "profilePhoto"],
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/commentlike", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Video does not exist.");
    }
    await comment.removeCommentLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//recomment
//recomment
router.post("/:id/recomment", isLoggedIn, async (req, res, next) => {
  try {
    // console.log("remomment req.body :", req.body);
    const exComment = await db.Comment.findOne({
      where: { id: req.params.id },
    });
    if (!exComment) {
      return res.status(404).send("Comment does not exist.");
    }

    const recomment = await db.Comment.create({
      content: req.body.content,
      UserId: req.user.id,
      RecommenterId: req.user.id,
    });

    const fullComment = await db.Comment.findOne({
      where: {
        id: recomment.id,
      },
      include: [
        {
          model: db.User,
          as: "Recommenter",
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.User,
          through: "CommentLike",
          as: "CommentLikers",
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.User,
          through: "CommentDislike",
          as: "CommentDislikers",
          attributes: ["id", "nickname", "profilePhoto"],
        },
      ],
    });

    await exComment.addRecomment(fullComment);

    res.json(fullComment);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete(
  "/:id/recomment/:recommentId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const comment = await db.Comment.findOne({
        where: { id: req.params.id },
      });
      if (!comment) {
        return res.status(404).send("Comment does not exist.");
      }
      await comment.removeRecomment(req.params.recommentId);
      res.json({ recommentId: req.params.recommentId });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

// comment dislike
// comment dislike
// comment dislike
router.post("/:id/commentDislike", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Comment does not exist.");
    }
    await comment.addCommentDisliker(req.user.id);

    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "nickname", "profilePhoto"],
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/commentDislike", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Comment does not exist.");
    }
    await comment.removeCommentDisliker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
