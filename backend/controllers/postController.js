const Post = require("../models/post");

exports.newPost= async (req, res) => {
      const { image, caption } = req.body;
      const userId = req.user._id;

       const post= new Post({
           user: userId,
           image,
           caption
       });
       await post.save();
       res.status(201).json({ message: "Post created successfully", post });
};

exports.getPosts = async (req, res) => {
    const posts = await Post.find().populate("user", "name userName profilePicture");
    res.status(200).json({ posts });
};
exports.getPostById = async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("user", "name userName profilePicture");
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
};

