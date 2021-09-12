const { response } = require("express");
const mongoose = require("mongoose");
const Post = require("../models/Post");

exports.get_all_posts = (req, res, next) => {
  Post.find()
    .select("_id title desc image")
    .exec()
    .then((posts) => {
      res.status(200).json({
        status: true,
        message: "All the posts fecthed successfully!",
        posts: posts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        message: "Post could not be fecthed!",
        error: err,
      });
    });
};

exports.create_post = (req, res, next) => {
  Post.find({ title: req.body.title })
    .exec()
    .then((post) => {
      if (post.length >= 1) {
        return res.status(422).json({
          status: false,
          message: "This post title been taken already!",
        });
      } else {
        const post = new Post({
          _id: new mongoose.Types.ObjectId(),
          title: req.body.title,
          desc: req.body.desc,
          image: req.file.path,
        });

        post
          .save()
          .then((postRes) => {
            res.status(201).json({
              status: true,
              message: "Post has been created successfully!",
              post: {
                _id: postRes._id,
                title: postRes.title,
                desc: postRes.desc,
                image: postRes.image,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: false,
              message: "The post could not be created!",
              error: err,
            });
          });
      }
    });
};

exports.get_post = (req, res, next) => {
  Post.findById(req.params.id)
    .select("_id title desc image")
    .exec()
    .then((post) => {
      if (post) {
        res.status(200).json({
          status: true,
          message: "Post fecthed successfully!",
          post: post,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Post could not be found!", // Not working
          error: err,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Post could not be fecthed!",
        error: err,
      });
    });
};

exports.update_post = (req, res, next) => {
  Post.updateOne(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        desc: req.body.desc,
        image: req.file.path,
      },
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "The post has been updated successfully!", // Not working while udpating non-existence post
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "The post could not be updated!",
        error: err,
      });
    });
};

exports.delete_post = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .exec()
    .then((res) => {
      res.status(200).json({
        status: true,
        message: "Post deleted successfully!", // Not working
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Post could not be deleted!",
        error: err,
      });
    });
};
