const express = require("express");
const router = express.Router();

const PostController = require("../controllers/PostController");

const AuthMiddleware = require("../middleware/auth");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

router.get("/:id", AuthMiddleware, PostController.get_post);
router.get("/", PostController.get_all_posts);
router.post(
  "/",
  upload.single("image"),
  AuthMiddleware,
  PostController.create_post
);
router.patch(
  "/:id",
  upload.single("image"),
  AuthMiddleware,
  PostController.update_post
);
router.delete("/:id", AuthMiddleware, PostController.delete_post);

module.exports = router;
