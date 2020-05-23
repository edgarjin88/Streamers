const db = require("../models");

require("dotenv").config();

exports.deleteNotification = async (req, res, next) => {
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
    res.send(allNotifications);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
exports.deleteSingleNotification = async (req, res, next) => {
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
  };
};
