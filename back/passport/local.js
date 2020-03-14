const passport = require('passport');
const {
  Strategy: LocalStrategy
} = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'password',
  }, async (userId, password, done) => {
    try {
      const user = await db.User.findOne({
        where: {
          userId
        }
      });
      if (!user) {
        return done(null, false, {
          reason: 'Invalid ID!'
        });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }
      return done(null, false, {
        reason: 'Incorrect Password'
      });
    } catch (e) {
      console.error(e);
      return done(e);
    }
  }));
};