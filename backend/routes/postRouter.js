const router = require("express").Router();
const { body } = require("express-validator");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const  isAuthenticated= require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { newPost, getPosts, getPostById } = require("../controllers/postController");

const validators = {
  newPost: [
    body("caption").optional().isString().withMessage("Caption must be a string"),
  ],
};

router.post("/upload", isAuthenticated, upload.single("image"), validators.newPost, catchAsyncErrors(newPost));
router.get("/", isAuthenticated, catchAsyncErrors(getPosts));
router.get("/:id", isAuthenticated, catchAsyncErrors(getPostById));

module.exports = router;

