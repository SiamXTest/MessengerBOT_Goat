const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "ball",
    aliases: ["kickball"],
    version: "1.3",
    author: "Bhau",
    countDown: 5,
    role: 0,
    shortDescription: "Tag someone to kick the ball 😹",
    longDescription: "A funny image generation command to kick someone’s ball.",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    const ADMIN_UID = "100051869042398";

    if (mention.length === 0) {
      return message.reply("⚠️ Please mention someone to kick their ball 😼");
    }

    if (mention.includes(ADMIN_UID)) {
      return message.reply("😼 Hey baka, f*ck your ball.");
    }

    const one = event.senderID;
    const two = mention[0];

    bal(one, two).then(ptth => {
      message.reply({
        body: "😹 Fuck your ball",
        attachment: fs.createReadStream(ptth)
      });
    });
  }
};

async function bal(one, two) {
  const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avone.circle();

  const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avtwo.circle();

  const pth = "ball.png";
  const img = await jimp.read("https://i.ibb.co/6Jz7yvX/image.jpg");

  img
    .resize(1080, 1320)
    .composite(avone.resize(170, 170), 200, 320)
    .composite(avtwo.resize(170, 170), 610, 70);

  await img.writeAsync(pth);
  return pth;
}