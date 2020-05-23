const db = require("../models");

require("dotenv").config();

const { socketList } = require("../socket/socket");

const { imageLink } = require("../utilities/multerOptions");

exports.changeDescription = async (req, res, next) => {
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
};

exports.changeNickname = async (req, res, next) => {
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
};
exports.getFavoriteVideos = async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: { [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10) },
      }; // less than last id.
    }
    const user = await db.User.findOne({
      where: { id: req.user.id },
    });
    const likedVideos = await user.getLiked({
      where,
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
      order: [["createdAt", "DESC"]], // DESC, ASC
      limit: parseInt(req.query.limit, 10),
    });

    res.json(likedVideos);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
exports.getUserVideos = async (req, res, next) => {
  try {
    let where = {
      UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
    }; //two different "wheres"
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10) }; // less than last id.
    }

    const videos = await db.Video.findAll({
      where,
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
      order: [["createdAt", "DESC"]], // DESC, ASC
      limit: parseInt(req.query.limit, 10),
    });
    res.json(videos);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.deleteFollow = async (req, res, next) => {
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
};

exports.follow = async (req, res, next) => {
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
};

exports.deleteFollower = async (req, res, next) => {
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
};

exports.getFollowers = async (req, res, next) => {
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
};

exports.getFollowings = async (req, res, next) => {
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
};

exports.getMyInfo = async (req, res, next) => {
  try {
    const user = Object.assign({}, req.user.toJSON());

    delete user.password;
    return res.json(user);
  } catch (e) {
    console.error(" error getting userInfo :", e);
    next(e);
    return res.status(400).send(e);
  }
};

exports.updateProfile = async (req, res, next) => {
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
};

exports.getUserInfo = async (req, res, next) => {
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
};
