const { generateToken } = require("../config/generateToken");
const User = require("../models/user");
const sendEmail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res, next) => {
    const { email, password, name, userName } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
        email,
        password,
        name,
        userName,
    });
   const token= generateToken(res, user._id);
   console.log(token)
    res.status(201).json({ message: "User registered", user, token });
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("Logging in user:", { email });
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(res, user._id);
    res.status(200).json({ message: "User logged in", user });
};

exports.logoutUser = async (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({ message: "User logged out" });
};

exports.resetPassword = async (req, res, next) => {
    const {email,oldPassword, newPassword} = req.body;
     
     const user= await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
     const isMatch = await user.comparePassword(oldPassword);
     if(!isMatch){
        return res.status(400).json({message: "invalid old password"});
     }
        user.password = newPassword;
        await user.save();
        generateToken(res, user._id);
    res.status(200).json({ message: "Password reset successfully" });

};

exports.getAccountDetails = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
};

exports.getUserDetails = async (req, res, next) => {
    const username = req.params.username;
  
    const user = await User.findOne({ username })
      .populate("followers", "username profileImage")
      .populate("following", "username profileImage")
      .populate({
        path: "posts",
        populate: [
          {
            path: "comments",
            populate: { path: "user", select: "username profileImage" },
          },
          {
            path: "postedBy",
            select: "username profileImage",
          },
        ],
      })
      .populate({
        path: "saved",
        populate: [
          {
            path: "comments",
            populate: { path: "user", select: "username profileImage" },
          },
          {
            path: "postedBy",
            select: "username profileImage",
          },
        ],
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
};


exports.deleteAccount = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }  
    res.cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({ message: "User account deleted successfully" });
};

exports.updateUserProfile = async (req, res, next) => {
    const { name, userName, bio, profilePicture } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.userName = userName || user.userName;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user= await User.findOne({email});
  if(!user) return res.status(404).json({ message: "User not found" });

  const resetToken=jwt.sign({userId :user._id},process.env.JWT_SECRET,{expiresIn:'15m'})
  const htmlContent = `<h3>Reset Your Password</h3><p>Click the link below to reset your password:</p><a href="http://localhost:5000/api/user/reset-password/${resetToken}">Reset Password</a>`;

  try {
    await sendEmail(email, "Reset Your Password", htmlContent);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email" });
  }
};

exports.resetPassword= async (req,res)=>{
     const { token } = req.params;
     const { newPassword } = req.body;
    
     const decoded =jwt.verify(token, process.env.JWT_SECRET);
     const user =await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = newPassword;
        await user.save();
        generateToken(res, user._id);
        res.status(200).json({ message: "Password reset successfully" });
}

exports.followUser = async (req, res) => {
        const userId= req.userId;
        const { followUserId } = req.body;


        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);
        if (!user || !followUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.following.includes(followUserId)) {
            return res.status(400).json({ message: "You are already following this user" });
        }
        user.following.push(followUserId);
        followUser.followers.push(userId);
        await user.save();
        await followUser.save();
        res.status(200).json({ message: "User followed successfully" });
}

exports.unfollowUser = async (req, res) => {
    const userId = req.userId;
    const { unfollowUserId } = req.body;

    const user= await User.findById(userId);
    const unfollowUser = await User.findById(unfollowUserId);
    if (!user || !unfollowUser) {
        return res.status(404).json({ message: "User not found" });
    }   
    if (!user.following.includes(unfollowUserId)) {
        return res.status(400).json({ message: "You are not following this user" });
    }
    user.following = user.following.filter(id => id.toString() !== unfollowUserId);
    unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userId);
    await user.save();
    await unfollowUser.save();
    res.status(200).json({ message: "User unfollowed successfully" });
};


exports.profileImage = async (req, res) => {
        const userId = req.userId;
        
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const imagePath = req.file.path.replace(/\\/g, "/");
        const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.profilePicture = imageUrl;
        await user.save();
        
        res.status(200).json({ 
            message: "Profile picture updated successfully", 
            profilePicture: imageUrl 
        });
    } 
