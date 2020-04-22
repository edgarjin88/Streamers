const express = require("express");
const db = require("../models");

const router = express.Router();
// use last id rather than offset due to performance reason
router.get("/:tag", async (req, res, next) => {
  try {
    let where = {}; //
    if (parseInt(req.query.lastId, 10)) {
      //query !
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const videos = await db.Video.findAll({
      where,
      include: [
        {
          model: db.Hashtag,
          where: { name: decodeURIComponent(req.params.tag) }, //for Korean
        },
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
          attributes: ["id"],
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
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10),
    });
    res.json(videos);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
