const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gay",
    version: "1.1",
    author: "Bhau",
    countDown: 1,
    role: 0,
    shortDescription: "Check who's gay 😹",
    longDescription: "Generate a funny 'gay' image using DIG library",
    category: "fun",
    guide: "{pn} [@mention or reply]",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const mention = Object.keys(event.mentions);
    const ADMIN_UID = "100051869042398";

    let uid;

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (mention[0]) {
      uid = mention[0];
    } else {
      uid = event.senderID;
    }

    // Admin UID check
    if (uid === ADMIN_UID) {
      return message.reply("😼 You gay, baka!");
    }

    const url = await usersData.getAvatarUrl(uid);
    const img = await new DIG.Gay().getImage(url);
    const pathSave = `${__dirname}/tmp/gay.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));

    const body = !mention[0] && event.type !== "message_reply"
      ? "Baka you gay😆\n"
      : "Look... I found a gay 🌈";

    return message.reply(
      {
        body,
        attachment: fs.createReadStream(pathSave)
      },
      () => fs.unlinkSync(pathSave)
    );
  }
};