const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback", // Match your route
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || "Google User",
            email: profile.emails?.[0]?.value,
            userName: `google_${profile.id}`, // generate fallback
            profilePicture:
              profile.photos?.[0]?.value ||
              "https://res.cloudinary.com/dz1qj3v5f/image/upload/v1698851234/Instagram/defaultProfilePicture.png",
          });
        }
        return done(null, user); // Pass user to route handler
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
