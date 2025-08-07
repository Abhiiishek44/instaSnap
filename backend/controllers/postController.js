const Post = require("../models/post");

exports.newPost = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
    }
    const { caption } = req.body;
    const userId = req.userId; // Use req.userId instead of req.user._id
    console.log("User ID:", userId);
    console.log("Received caption:", req.body);
    
    // Create a proper URL for the image
    const imagePath = req.file.path.replace(/\\/g, "/");
    const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;
    console.log("Image URL:", imageUrl);
    
    const post = new Post({
        user: userId,
        image: imageUrl,
        caption
    });
    console.log("New post created:", post);

    await post.save();
    
    // Populate the user details in the newly created post before sending it back
    const populatedPost = await Post.findById(post._id).populate("user", "name userName profilePicture");
    
    res.status(201).json({ message: "Post created successfully", post: populatedPost });
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

