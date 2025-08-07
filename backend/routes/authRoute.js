const express = require("express");
const { cookie } = require("express-validator");
const passport = require("passport");
const router = express.Router();
const { generateToken } = require("../config/generateToken"); // Fix: Use destructured import

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login",
    }),
    (req, res) => {
        try {
            generateToken(res, req.user._id);

            res.redirect(`http://localhost:5173`);
        } catch (error) {
            console.error("Google callback error:", error);
            res.redirect(`http://localhost:5173/login?error=auth_failed`);
        }
    }
);

module.exports = router;
