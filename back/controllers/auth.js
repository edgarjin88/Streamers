const sgMail = require("@sendgrid/mail");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const expressJWT = require("express-jwt");
const _ = require("lodash");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.passwordReset = (req, res) => {
  const { email } = req.body;

      const exUser = await db.User.findOne({
        where: {
          userId: userId
        }
      });
  if (!exUser) {
    return res.status(400).send('Cannot find any user by the entered email address')
  }
    const token = jwt.sign(
      //create token
      { userId: email},
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" } // because it is only for email verification.
    );

    // console.log("test :", email, password, name);
    let emailData = {
      // from: process.env.EMAIL_FROM,
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Reset Password",
      html: `
      <h2>Please use the following link to reset your password</h2>
      <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}">${process.env.CLIENT_URL}/auth/password/reset/${token}</a>
      <hr/>
      <p>This email may contain sensetive information</p>
      <p>${process.env.CLIENT_URL} 'what is this?' </p>
      `
    };

    return user.updateOne({ resetPassword: token }, (err, success) => {
      if (err) {
        console.log("Resetp password link error", err);
        return res.status(400).json({
          error: "Database connection error on user password forgot request"
        });
      } else {
        transporter
          .sendMail(emailData)
          .then(sent => {
            // console.log('SIGNUP EMAIL SENT', sent);
            return res.json({
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`
            });
          })
          .catch(err => {
            // console.log('SIGNUP EMAIL SENT ERROR', err);
            console.log("err :", err);
            return res.json({ message: err.message });
          });
      }
    });
  });
};

exports.signup = async (req, res) => {
  const { nickname, userId, password } = req.body;

  const exUser = await db.User.findOne({
    where: {
      userId: userId
    }
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
    subject: `Account activation link`,
    html: `
               <h1>Hi ${nickname},  Wellcome to STREAMERS !</h1>
                <p>In order to activate your STREAMERS account, please click the below link. </p>
                <hr />
                <p><a href="${process.env.CLIENT_URL}/activate/${token}">Click Here</a></p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
  };

  sgMail
    .send(emailData)
    .then(sent => {
      // console.log('SIGNUP EMAIL SENT', sent)
      return res.send(
        `Email has been sent to ${userId}. Follow the instruction to activate your account`
      );
    })
    .catch(err => {
      // console.log('SIGNUP EMAIL SENT ERROR', err)
      return res.send(err.message);
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  console.log("activation fired :", token);
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function(
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
          userId: userId
        }
      });
      if (exUser) {
        return res.status(400).send("Someone is already using the ID");
      }

      const hashedPassword = await bcrypt.hash(password, 12); // salt to be 10~13
      const newUser = await db.User.create({
        nickname,
        userId,
        password: hashedPassword
      });
      delete newUser.password;
      console.log("new user without password", newUser);
      return res.status(200).json(newUser);
    });
  } else {
    return res.send("Something went wwrong. Try again");
  }
};
