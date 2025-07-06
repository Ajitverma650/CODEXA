const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./src/config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./src/routes/userAuth");
const redisClient = require('./src/config/redis');
const problemRouter = require("./src/routes/problemCreator");
const submitRouter = require("./src/routes/submit");
const aiRouter = require("./src/routes/aiChatting");
const videoRouter = require("./src/routes/videoCreator");
const cors = require('cors');

// ✅ Allow all localhost and *.vercel.app domains (preview + production)
app.use(cors({
  origin: function (origin, callback) {
    const allowedLocalhost = origin && origin.startsWith('http://localhost');
    const allowedVercel = origin && origin.endsWith('.vercel.app');

    if (!origin || allowedLocalhost || allowedVercel) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);

// Initialize DB and Redis, then start server
const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("✅ DB Connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server listening at port number: ${PORT}`);
    });
  } catch (err) {
    console.log("❌ Error during server init:", err);
  }
};

InitalizeConnection();

