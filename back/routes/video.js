const express = require("express");

const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

const { imageLink, upload } = require("../utilities/multerOptions");

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
      console.log(result);
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
      console.log("each v :", v);
      console.log("each v[imageLink] :", v[imageLink]);
      return v[imageLink];
    })
  );
});

///////

router.patch("/:id", isLoggedIn, async (req, res, next) => {
  try {
    console.log("patch fired", req.body.description);
    console.log("patch fired whole body", req.body);
    console.log("id", req.params.id);
    const video = await db.Video.findOne({
      where: { id: req.params.id },
    });

    if (!video) {
      return res.status(404).send("video does not exist.");
    }

    await video.update({ description: req.body.description });
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
            // {
            //   model: db.User,
            //   through: "Follow",
            //   as: "Followings",
            //   attributes: ["id"],
            // },
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
      ],
    });
    video;
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
  // :id/comments==  video.id/coments
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    const comments = await db.Comment.findAll({
      where: {
        VideoId: req.params.id,
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.User,
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

router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  // POST /api/post/1000000/comment  /// !== comments
  try {
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
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"],
        },
      ],
    });
    console.log("comment info :", comment);
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const video = await db.Video.findOne({ where: { id: req.params.id } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await video.addLiker(req.user.id);
    res.json({ userId: req.user.id });
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

router.post("/:id/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const video = await db.Video.findOne({
      where: { id: req.params.id }, // video with ':id'
      include: [
        {
          model: db.Video,
          as: "Retweet", //   db.Video.belongsTo(db.Video, { as: 'Retweet' });
        }, // this will bring Retweet info. At this point, RetweetId is null, so Retweet is null too.
      ],
    });
    console.log("retweet video :", video);
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    if (
      req.user.id === video.UserId ||
      (video.Retweet && video.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("You cannot retwit your video.");
    }
    const retweetTargetId = video.RetweetId || video.id;
    //RetweetId === null, so, video.id to be used

    const exVideo = await db.Video.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exVideo) {
      return res.status(403).send("You already retwitted.");
    }
    const retweet = await db.Video.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    console.log("retweet completed :", retweet);
    const retweetWithPrevVideo = await db.Video.findOne({
      //  include original post with retweet
      where: { id: retweet.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"],
        },
        {
          model: db.Video,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname", "profilePhoto"],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
    });
    console.log("with prev post: ", retweetWithPrevVideo);
    res.json(retweetWithPrevVideo);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
