const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
require(path.join(__dirname, 'bot/bot.js'));

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const Invite = require("./model/InviteSchema");
const { Server } = require("socket.io");
const cors = require('cors');
const { InviteController } = require('./controller/InviteController');
const app = express();
dotenv.config();
app.use(cors())

app.get("/generate-invite", InviteController);

const io = new Server({
  cors: { origin: "*" },
});

io.on("connection", async (socket) => {
  console.log("🔵 New connection attempt...");

  const token = socket.handshake.query.token;
  if (!token) {
    socket.disconnect(true);
    return;
  }

  const invite = await Invite.findOne({ token });
  if (!invite || invite.expiresAt < Date.now()) {
    socket.emit("error", "Invalid or expired invite");
    socket.disconnect(true);
    return;
  }

  console.log(`✅ User joined with token: ${token}`);
  socket.emit("message", "Welcome to White Sync!");

  socket.on("canvasImage", (data) => {
    socket.broadcast.emit("canvasImage", data);
  });

  socket.on("disconnect", async () => {
    console.log(`❌ User disconnected.`);
  });
});

io.listen(5000);

app.use(express.json());
const port = process.env.PORT || 3000;
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Mongo db successfully connected");

    app.listen(port, () => {
      console.log(`✅ Server start at: ${port}`);
    });
  } catch (e) {
    console.error("❌ Server error:", e.message);
  }
})();
