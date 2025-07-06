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

// ✅ Allow both localhost and Vercel frontend domain
const allowedOrigins = [
  'http://localhost:5173',
  'https://codexa-lpkc.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routers
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);

// Initialize DB and Redis, then start server
const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server listening at port number: " + process.env.PORT);
    });
  } catch (err) {
    console.log("Error: " + err);
  }
};

InitalizeConnection();
