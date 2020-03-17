const express = require("express");
const multer = require("multer");

const path = require("path");
const db = require("../models");
const { isLoggedIn } = require("./middleware");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const router = express.Router();
const imageLink =
  process.env.NODE_ENV === "production" ? "location" : "filename";

AWS.config.update({
  region: "ap-southeast-2", //sydney
  accessKeyId: process.env.S3_ACCESS_KEY_ID, // to access s3 from node
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});

let multerStorage = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // put filename, jpg,
      done(null, basename + new Date().valueOf() + ext); //done callback function create new name
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
});

let multerServer = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "sumontee",
    key(req, file, cb) {
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
});

const upload =
  process.env.NODE_ENV === "production" ? multerServer : multerStorage;

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  //none(), only text allowed
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() }
          })
        )
      );
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }

    if (req.body.image) {
      //we are not using multer here. only address
      // if array,  image: [address1, address2]
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          //wait for all record on DB
          req.body.image.map(image => {
            return db.Image.create({ src: image });
          })
        );
        await newPost.addImages(images);
      } else {
        //for one image, image: address 1.
        const image = await db.Image.create({ src: req.body.image });

        await newPost.addImage(image);
      }
    }

    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: db.User
        },
        {
          model: db.Image
        }
      ]
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/images", upload.array("image"), (req, res) => {
  res.json(
    req.files.map(v => {
      console.log("each v :", v);
      console.log("each v[imageLink] :", v[imageLink]);
      return v[imageLink];
    })
  );
});

///////
router.post("/profile", upload.single("image"), async (req, res) => {
  //image from "image" in formdata
  //req.body.image, req.body.content
  // if different name for each file, you can use upload.fields()
  console.log("req.files", req.file);
  res.json(req.file[imageLink]);
  try {
    console.log("profilePhoto address", req.file[imageLink]);
    await db.User.update(
      {
        profilePhoto: req.file[imageLink]
      },
      {
        where: { id: req.user.id }
      }
    );
    res.send(req.file[imageLink]);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch("/:id", isLoggedIn, async (req, res, next) => {
  try {
    console.log("patch fired", req.body.content);
    console.log("patch fired whole body", req.body);
    console.log("id", req.params.id);
    const post = await db.Post.findOne({
      where: { id: req.params.id }
    });

    if (!post) {
      return res.status(404).send("Post does not exist.");
    }

    await post.update({ content: req.body.content });
    res.send(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
//////
router.get("/:id", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"]
        },
        {
          model: db.Image
        }
      ]
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("Post does not exist.");
    }
    await db.Post.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/:id/comments", async (req, res, next) => {
  // :id/comments==  post.id/coments
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("Post does not exist.");
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"]
        }
      ]
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
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("Post does not exist.");
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"]
        }
      ]
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
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("Post does not exist.");
    }
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("Post does not exist.");
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id }, // post with ':id'
      include: [
        {
          model: db.Post,
          as: "Retweet" //   db.Post.belongsTo(db.Post, { as: 'Retweet' });
        } // this will bring Retweet info. At this point, RetweetId is null, so Retweet is null too.
      ]
    });
    console.log("retweet post :", post);
    if (!post) {
      return res.status(404).send("Post does not exist.");
    }
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("You cannot retwit your post.");
    }
    const retweetTargetId = post.RetweetId || post.id;
    //RetweetId === null, so, post.id to be used

    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId
      }
    });
    if (exPost) {
      return res.status(403).send("You already retwitted.");
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet"
    });
    console.log("retweet completed :", retweet);
    const retweetWithPrevPost = await db.Post.findOne({
      //  include original post with retweet
      where: { id: retweet.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"]
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname", "profilePhoto"]
            },
            {
              model: db.Image
            }
          ]
        }
      ]
    });
    console.log("with prev post: ", retweetWithPrevPost);
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
