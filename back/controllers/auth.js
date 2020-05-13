const sgMail = require("@sendgrid/mail");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.confirmPasswordReset = async (req, res, next) => {
  console.log("confirm fired :", req.body);
  try {
    const { resetPasswordLink, password } = req.body;
    console.log("password :", password);
    console.log("link :", resetPasswordLink);
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("password :", hashedPassword);
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

  // console.log("test :", email, password, name);
  let emailData = {
    // from: process.env.EMAIL_FROM,
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
    console.log("updated token :", token);
    await exUser.update({ resetPasswordLink: token });

    console.log("updated user :", exUser);
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
      // console.log('SIGNUP EMAIL SENT', sent)
      return res.send(
        `Activation email has been sent to ${userId}. Follow the instruction to activate your account`
      );
    })
    .catch((err) => {
      // console.log('SIGNUP EMAIL SENT ERROR', err)
      return res.send(err.message);
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  console.log("activation fired :", token);
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (
      err,
      decoded
    ) {
      if (err) {
        console.log("JWT veirfy in account activation error :", err);
        return res.status(401).send("Token expired. Please signup again");
      }

      console.log("decoded :", decoded);
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
      console.log("new user without password", newUser);
      return res.status(200).json(newUser);
    });
  } else {
    return res.send("Something went wwrong. Try again");
  }
};

exports.passwordChange = async (req, res, next) => {
  try {
    console.log("passowr update started :", req.body.password.password);
    const hashedPassword = await bcrypt.hash(req.body.password.password, 12);

    console.log("user id:", req.user.id);
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
