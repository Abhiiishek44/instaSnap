const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/database'); 
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoute');
const passport = require("passport");
const userRouter =require('./routes/userRoute')


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


app.use("/api/auth", authRoutes);
app.use('/api/user',userRouter)


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
