const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(422).json({
          status: false,
          message: "Email is already been taken!",
          error: "Email is already been taken!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "Sign up failed!",
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  status: true,
                  message: "You have signed up successfully!",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  status: false,
                  message: "Sign up failed!",
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Sign up failed!",
        error: err,
      });
    });
};

exports.user_login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Incorrect email or password!",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            status: false,
            message: "Incorrect email or password!",
          });
        }
        if (result) {
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_TOKEN_PRIVATE_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            success: true,
            token: token,
          });
        }
        return res.status(401).json({
          status: false,
          message: "Incorrect email or password!",
        });
      });
    });
};
