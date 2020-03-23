const sgMail = require("@sendgrid/mail");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const expressJWT = require("express-jwt");
const _ = require("lodash");
// const fetch = require("node-fetch");
require("dotenv").config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  const { nickname, userId, password } = req.body;

  const exUser = await db.User.findOne({
    where: {
      userId: userId
    }
  });
  if (exUser) {
    return res.status(400).json({
      error: "Someone is already using the ID"
    });
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
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
  };

  sgMail
    .send(emailData)
    .then(sent => {
      // console.log('SIGNUP EMAIL SENT', sent)
      return res.json({
        message: `Email has been sent to ${userId}. Follow the instruction to activate your account`
      });
    })
    .catch(err => {
      // console.log('SIGNUP EMAIL SENT ERROR', err)
      return res.json({
        message: err.message
      });
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function(
      err,
      decoded
    ) {
      if (err) {
        console.log("JWT veirfy in account activation error :", err);
        return res.status(401).json({
          error: "Expired link. Signup Again"
        });
      }

      console.log("decoded :", decoded);
      const { nickname, userId, password } = jwt.decode(token);

      const exUser = await db.User.findOne({
        where: {
          userId: userId
        }
      });
      if (exUser) {
        return res.status(400).json({
          error: "Someone is already using the ID"
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt to be 10~13
      const newUser = await db.User.create({
        nickname,
        userId,
        password: hashedPassword
      });

      newUser.save((err, user) => {
        if (err) {
          console.log("Saveuser in Account activation error: ", err);
          return res.status(401).json({
            error: "Error saving user in database. Try signup again"
          });
        }
        return res.json({
          message: "Signup success. Please Sign in"
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wwrong. Try again"
    });
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist"
      });
    }
    const token = jwt.sign(
      //create token
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" } // because it is only for email verification.
    );

    let transporter = nodemailer.createTransport({
      service: "naver",
      host: "smtp.naver.com",
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD // generated ethereal password
      }
    });

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

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: "Expired link. Try again"
        });
      }
      console.log("decoded :", decoded);

      // User.findOne({resetPasswordLink}, (err, user)=>{ //  original code
      User.findOne({ _id: decoded._id }, (err, user) => {
        if (err || !user) {
          console.log("user: ", user);
          console.log("err: ", err);
          return res.status(400).json({
            error: "Something went wrong. Try again"
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password"
            });
          }

          res.json({
            message: "Great! You can log in with new passowrd"
          });
        });
      });
    });
  }
};
// const sendCancelationEmail = (email, name) => {
//   sgMail.send({
//     to: email,
//     from: "andrew@mead.io",
//     subject: "Sorry to see you go!",
//     text: `Goodbye, ${name}. I hope to see you back sometime soon.`
//   });
// };

// module.exports = {
//   sendWelcomeEmail,
//   sendCancelationEmail
// };
