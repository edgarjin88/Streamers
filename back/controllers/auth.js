const sgMail = require("@sendgrid/mail");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.confirmPasswordReset = async (req, res, next) => {
  try {
    const { resetPasswordLink, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const exUser = await db.User.findOne({
      where: { resetPasswordLink: resetPasswordLink },
    });
    if (!exUser) {
      return res
        .status(400)
        .send("Cannot find any user with the token. Please try again.");
    }
    await exUser.update({
      password: hashedPassword,
      resetPasswordLink: "",
    });
    return res.send("Updated you passowrd successfully");
  } catch (e) {
    console.error(" error confirmation :", e);
    // next(e);
    return res.status(400).send(e);
  }
};

exports.passwordReset = async (req, res) => {
  const { userId } = req.body;

  const exUser = await db.User.findOne({
    where: {
      userId: userId,
    },
  });
  if (!exUser) {
    return res
      .status(400)
      .send("Cannot find any user by the entered email address");
  }
  const token = jwt.sign(
    { userId: userId },
    process.env.JWT_RESET_PASSWORD,
    { expiresIn: "10m" } // because it is only for email verification.
  );

  let emailData = {
    from: "no-reply@streamers.com",
    to: userId,
    subject: "Password reset email for your Streamers account.",
    html: `
      <h2>Please use the following link to reset your password</h2>
      <a href="${process.env.CLIENT_URL}/confirm-password-reset/${token}">Click here to reset your password</a>
      <hr/>
      <p>This email may contain sensetive information</p>
      <p>${process.env.CLIENT_URL} 'what is this?' </p>
      `,
  };
  try {
    await exUser.update({ resetPasswordLink: token });

    sgMail.send(emailData).then((sent) => {
      return res
        .status(200)
        .send(
          `Email has been sent to ${userId}. Please follow the instructino to activate your account`
        );
    });
  } catch (e) {
    console.error(e);
    res
      .status(400)
      .send("Database connection error on the user password reset request");
  }
};

exports.signup = async (req, res) => {
  const { nickname, userId, password } = req.body;

  const exUser = await db.User.findOne({
    where: {
      userId: userId,
    },
  });
  if (exUser) {
    return res.status(400).send("Someone is already using the ID");
  }

  const token = jwt.sign(
    { nickname, userId, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: userId,
    subject: `Account activation email`,
    html: `
               <h1>Hi ${nickname},  Wellcome to STREAMERS !</h1>
                <p>In order to activate your STREAMERS account, please click the below link. </p>
                <hr />
                <p><a href="${process.env.CLIENT_URL}/activate/${token}">Click Here</a></p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
  };

  sgMail
    .send(emailData)
    .then((sent) => {
      return res.send(
        `Activation email has been sent to ${userId}. Follow the instruction to activate your account`
      );
    })
    .catch((err) => {
      return res.send(err.message);
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).send("Token expired. Please signup again");
      }

      const { nickname, userId, password } = jwt.decode(token);

      const exUser = await db.User.findOne({
        where: {
          userId: userId,
        },
      });
      if (exUser) {
        return res.status(400).send("Someone is already using the ID");
      }

      const hashedPassword = await bcrypt.hash(password, 12); // salt to be 10~13
      const newUser = await db.User.create({
        nickname,
        userId,
        password: hashedPassword,
      });
      delete newUser.password;
      return res.status(200).json(newUser);
    });
  } else {
    return res.send("Something went wwrong. Try again");
  }
};

exports.passwordChange = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password.password, 12);

    const me = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!me) {
      return res.status(400).send("User not found");
    }
    await me.update({
      password: hashedPassword,
    });
    return res.status(200).send("Password updated successfully");
  } catch (e) {
    console.error(e);
    res.status(400).send("Unable to change password. Please try again later.");
    // next(e);
  }
};

exports.logOut = async (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("LOGOUT Success");
};

exports.logIn = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: {
            id: user.id,
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
          attributes: [
            "id",
            "nickname",
            "userId",
            "profilePhoto",
            "notification",
          ],
        });

        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
};
