const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser'); // for parsing cookies
const connectDB = require('./config/database'); 
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoute');
const userRouter =require('./routes/userRoute')
const postRouter = require('./routes/postRouter');
const messageRouter = require('./routes/messageRoute');
const passport = require("passport");
const bodyParser = require('body-parser');
const http  =require('http');
const { Server } = require('socket.io');

require('./config/passport'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
     methods: ["GET", "POST"]
  }
});

let onlineUsers = {};


io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("addUser", (userId) => {
    if (userId) {
      onlineUsers[userId] = socket.id;
      console.log("Online Users:", onlineUsers);
      io.emit("getUsers", onlineUsers);
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    if (!senderId || !receiverId || !text) return;
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        receiverId,
        conversationId,
        text,
        createdAt: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of Object.entries(onlineUsers)) {
      if (sid === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
    io.emit("getUsers", onlineUsers);
    console.log("Client disconnected", socket.id);
  });
});

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
app.use('/api/chat', messageRouter);

app.use(errorMiddleware);
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server & Socket running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};




startServer();
