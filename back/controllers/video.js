const db = require("../models");
const { socketList } = require("../socket/socket");

// exports.updateVideo = async (req, res, next) => { }
exports.getVideos = async (req, res, next) => {
  try {
    let where = {}; //two different "wheres"
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // less than last id.
        },
      };
    }

    const videos = await db.Video.findAll({
      where, // if 0, just load info. because where is an empty object
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
          attributes: ["id"], //necessary? Yes. To play at the front with this id later.
        },
        {
          model: db.Video,
          as: "Retweet", //to load all info, must include retweet as well when "findAll".  ===
          include: [
            {
              model: db.User, // user info of retweeted video.
              attributes: ["id", "nickname", "profilePhoto"],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]], // DESC, ASC
      limit: parseInt(req.query.limit, 10),
    });
    res.json(videos);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.getPopularVideos = async (req, res, next) => {
  try {
    let where = {};
    let offsetCount = parseInt(req.query.lastId, 10);

    const videos = await db.Video.findAll({
      where, // if 0, just load info. because where is an empty object
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
          attributes: ["id"], //necessary? Yes. To play at the front with this id later.
        },
        {
          model: db.Video,
          as: "Retweet", //to load all info, must include retweet as well when "findAll".  ===
          include: [
            {
              model: db.User, // user info of retweeted video.
              attributes: ["id", "nickname", "profilePhoto"],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [["viewCount", "DESC"]],
      limit: parseInt(req.query.limit, 10),
      offset: offsetCount,
    });
    res.json(videos);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.removeDislikeComment = async (req, res, next) => {
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
};

exports.dislikeComment = async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Comment does not exist.");
    }
    await comment.addCommentDisliker(req.user.id);

    const targetUser = await db.User.findOne({
      where: { id: comment.UserId },
    });
    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "nickname", "profilePhoto"],
    });
    if (targetUser.id !== req.user.id) {
      await targetUser.update({ notification: targetUser.notification + 1 });

      const event = await db.Event.create({
        content: `${user.nickname} disliked your comment.`,
        targetVideoId: comment.VideoId,
        UserId: user.id,
        userProfile: user.profilePhoto,
        TargetUserId: comment.UserId,
      });

      const io = req.app.get("io");
      const targetSocket = socketList[comment.UserId];

      if (targetSocket) {
        io.to(targetSocket).emit("eventSentFromServer", {
          message: event.content,
          videoId: comment.VideoId,
          icon: user.profilePhoto,
        });
      }
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.removeRecomment = async (req, res, next) => {
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
};

exports.writeRecomment = async (req, res, next) => {
  try {
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

    const targetUser = await db.User.findOne({
      where: { id: exComment.UserId },
    });

    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "nickname", "profilePhoto"],
    });
    if (targetUser.id !== req.user.id) {
      await targetUser.update({ notification: targetUser.notification + 1 });

      const event = await db.Event.create({
        content: `${user.nickname} replied to your comment.`,
        targetVideoId: exComment.VideoId,
        UserId: user.id,
        userProfile: user.profilePhoto,
        TargetUserId: exComment.UserId,
      });

      const io = req.app.get("io");
      const targetSocket = socketList[exComment.UserId];

      if (targetSocket) {
        io.to(targetSocket).emit("eventSentFromServer", {
          message: event.content,
          videoId: fullComment.VideoId,
          icon: user.profilePhoto,
        });
      }
    }

    res.json(fullComment);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.removeLikeComment = async (req, res, next) => {
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
};
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
      return res.status(404).send("Comment does not exist.");
    }
    await comment.addCommentLiker(req.user.id);

    const targetUser = await db.User.findOne({
      where: { id: comment.UserId },
    });
    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "nickname", "profilePhoto"],
    });

    if (targetUser.id !== req.user.id) {
      await targetUser.update({ notification: targetUser.notification + 1 });

      const event = await db.Event.create({
        content: `${user.nickname} liked your comment.`,
        targetVideoId: comment.VideoId,
        UserId: user.id,
        userProfile: user.profilePhoto,
        TargetUserId: comment.UserId,
      });

      const io = req.app.get("io");
      const targetSocket = socketList[comment.UserId];

      if (targetSocket) {
        io.to(targetSocket).emit("eventSentFromServer", {
          message: event.content,
          videoId: comment.VideoId,
          icon: user.profilePhoto,
        });
      }
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.removeLikeVideo = async (req, res, next) => {
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
};

exports.likeVideo = async (req, res, next) => {
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

    if (targetUser.id !== req.user.id) {
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

      if (targetSocket) {
        io.to(targetSocket).emit("eventSentFromServer", {
          message: event.content,
          videoId: videoId,
          icon: liker.profilePhoto,
        });
      }
    }

    res.json({
      userId: req.user.id,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.removeDislikeVideo = async (req, res, next) => {
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
};
exports.dislikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;

    const video = await db.Video.findOne({ where: { id: videoId } });
    if (!video) {
      return res.status(404).send("Video does not exist.");
    }
    await video.addDisliker(req.user.id);

    const disliker = await db.User.findOne({ where: { id: req.user.id } });
    const targetUser = await db.User.findOne({ where: { id: video.UserId } });

    if (targetUser.id !== req.user.id) {
      await targetUser.update({ notification: targetUser.notification + 1 });

      const event = await db.Event.create({
        content: `${disliker.nickname} disliked your Streaming Channel: ${video.title}.`,
        targetVideoId: videoId,
        UserId: req.user.id,
        userProfile: req.user.profilePhoto,
        TargetUserId: video.UserId,
      });

      const io = req.app.get("io");

      const targetSocket = socketList[video.UserId];

      if (targetSocket) {
        io.to(targetSocket).emit("eventSentFromServer", {
          message: event.content,
          videoId: videoId,
          icon: disliker.profilePhoto,
        });
      }
    }

    res.json({
      userId: req.user.id,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.writeComment = async (req, res, next) => {
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

    const commenter = await db.User.findOne({ where: { id: req.user.id } });
    const targetUser = await db.User.findOne({
      where: { id: video.UserId },
    });
    if (targetUser.id !== req.user.id) {
      await targetUser.update({ notification: targetUser.notification + 1 });

      const event = await db.Event.create({
        content: `${commenter.nickname} commented on your channel: ${video.title}.`,
        targetVideoId: video.id,
        UserId: commenter.id,
        userProfile: commenter.profilePhoto,
        TargetUserId: video.UserId,
      });

      const io = req.app.get("io");

      const targetSocket = socketList[video.UserId];

      if (targetSocket) {
        io.to(targetSocket).emit("eventSentFromServer", {
          message: event.content,
          videoId: video.id,
          icon: commenter.profilePhoto,
        });
      }
    }

    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

exports.deleteComment = async (req, res, next) => {
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
};

exports.getComments = async (req, res, next) => {
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
};

exports.deleteVideo = async (req, res, next) => {
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
};

exports.getVideo = async (req, res, next) => {
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
};

exports.updateVideoStreaming = async (req, res, next) => {
  console.log("body update streaming :", req.body);
  const videoId = req.params.id;
  const io = req.app.get("io");
  const streaming = req.body.streaming;
  try {
    const exVideo = await db.Video.findOne({
      where: { id: videoId },
    });

    if (!exVideo) {
      return res.status(404).send("video does not exist.");
    }

    await exVideo.update({
      streaming: streaming,
    });

    if (streaming === "ON") {
      io.sockets.emit("streamingOn", { id: videoId });
    } else {
      io.sockets.emit("streamingOff", { id: videoId });
    }

    res.status(200).send("Successfully started streaming.");
  } catch (e) {
    console.error(e);
    next(e);
  }
};
exports.updateVideo = async (req, res, next) => {
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

    await exVideo.removeImages(images);

    const hashtags = req.body.description.match(/#[^\s]+/g);
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
};

exports.createVideo = async (req, res, next) => {
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
};
