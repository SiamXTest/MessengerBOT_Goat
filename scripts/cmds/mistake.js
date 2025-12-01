const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

const ADMIN_UID = "100051869042398";

module.exports = {
  config: {
    name: "mistake",
    aliases: ["mistake"],
    version: "1.1",
    author: "Bhau",
    countDown: 2,
    role: 0,
    shortdescription: "a mistake",
    longDescription: "Tag someone to show they're a mistake 😼",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return message.reply("⚠️ You must mention someone to use this command.");
    }

    const targetUID = mention[0];

    try {
      const imagePath = await bal(targetUID);

      const isAdmin = targetUID === ADMIN_UID;
      const caption = isAdmin
        ? "🛑 That's not a mistake... That's the creator. Respect, baka! 😼"
        : "💥 The Biggest Mistake on Earth";

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(imagePath)
      }, () => fs.unlinkSync(imagePath));
      
    } catch (error) {
      console.error("Error while running command:", error);
      return message.reply("❌ An error occurred while processing the image.");
    }
  }
};

async function bal(uid) {
  const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const templateURL = "https://i.postimg.cc/2ST7x1Dw/received-6010166635719509.jpg";

  const avatar = await jimp.read(avatarURL);
  const bg = await jimp.read(templateURL);

  bg.resize(512, 512).composite(avatar.resize(220, 203), 145, 305);

  const outPath = "mistake.png";
  await bg.writeAsync(outPath);
  return outPath;
}