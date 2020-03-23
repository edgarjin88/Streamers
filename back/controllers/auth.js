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
               <h1>Wellcome to Streamers ${userId}!</h1>
                <p>In order to activate your Streamers account, please click the below link. </p>
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
