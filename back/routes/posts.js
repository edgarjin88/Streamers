const express = require("express");
const db = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let where = {}; //two different "wheres"
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10) // less than last id.
        }
      };
    }
    const posts = await db.Post.findAll({
      where, // if 0, just load info. because where is an empty object
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profilePhoto"]
        },
        {
          model: db.Image
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"] //necessary? Yes. To play at the front with this id later.
        },
        {
          model: db.Post,
          as: "Retweet", //to load all info, must include retweet as well when "findAll".  ===
          include: [
            {
              model: db.User, // user info of retweeted post.
              attributes: ["id", "nickname", "profilePhoto"]
            },
            {
              model: db.Image
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]], // DESC, ASC
      limit: parseInt(req.query.limit, 10)
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
