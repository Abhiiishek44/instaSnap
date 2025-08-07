const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser'); // for parsing cookies
const connectDB = require('./config/database'); 
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoute');
const userRouter =require('./routes/userRoute')
const postRouter = require('./routes/postRouter');
const passport = require("passport");
const bodyParser = require('body-parser');

require('./config/passport'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  credentials: true
}));

// Middleware setup
app.use(bodyParser.json());
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use('/api/user',userRouter)
app.use('/api/post', postRouter);

app.use(errorMiddleware);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
