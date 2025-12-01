const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "condom",
    aliases: ["condom"],
    version: "1.1",
    author: "Bhau",
    countDown: 5,
    role: 0,
    shortDescription: "Make fun of your friends with condom fail meme",
    longDescription: "Overlay tagged user's avatar on a funny condom meme",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    const ADMIN_UID = "100051869042398";

    if (mention.length === 0) {
      return message.reply("⚠️ You must tag someone to use this command.");
    }

    const targetUID = mention[0];

    // Admin UID check
    if (targetUID === ADMIN_UID) {
      return message.reply("😆 Your father gay");
    }

    try {
      const imagePath = await generateImage(targetUID);
      await message.reply({
        body: "😆 Ops Crazy Condom Fails!",
        attachment: fs.createReadStream(imagePath)
      }, () => fs.unlinkSync(imagePath));
    } catch (error) {
      console.error("❌ Error while running condom command:", error);
      await message.reply("❌ An error occurred while generating the image.");
    }
  }
};

async function generateImage(uid) {
  const avatar = await jimp.read(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const bg = await jimp.read("https://i.imgur.com/cLEixM0.jpg");

  bg.resize(512, 512)
    .composite(avatar.resize(263, 263), 256, 258);

  const outPath = "condom_result.png";
  await bg.writeAsync(outPath);
  return outPath;
}