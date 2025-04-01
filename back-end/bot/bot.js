const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { InviteController } = require("../controller/InviteController");
dotenv.config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText == "/start") {
    const webAppUrl = `http://localhost:4040?token=${chatId}}`;
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Mini App",
              web_app: {
                url: webAppUrl,
              },
            },
          ],
        ],
      },
    };
    bot.sendMessage(chatId, "Choose an option: ", options);
  }
});
