const express = require('express');
const app = express();
require('dotenv').config();

const main = require('./src/config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import routes
const authRouter = require("./src/routes/userAuth");
const redisClient = require('./src/config/redis');
const problemRouter = require("./src/routes/problemCreator");
const submitRouter = require("./src/routes/submit");
const aiRouter = require("./src/routes/aiChatting");
const videoRouter = require("./src/routes/videoCreator");

// ✅ Allow only trusted origins
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://codexa-eolnxhj88-ajit-vermas-projects-7f732d05.vercel.app", // preview
  "https://codexa-git-fix-duplicate-k-e67b58-ajit-vermas-projects-7f732d05.vercel.app", // preview
  "https://codexa-sand.vercel.app" // ✅ main production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS Blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Optional: Debug logs for incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} from ${req.headers.origin}`);
  next();
});

// Middlewares
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
