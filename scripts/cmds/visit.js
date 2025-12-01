const axios = require("axios");

module.exports = {
  config: {
    name: "visit",
    version: "1.1",
    author: "Bhau",
    countDown: 5,
    role: 0,
    description: {
      en: "Send visits to a Free Fire UID using external API"
    },
    category: "game",
    guide: {
      en: "{pn} <uid> - Send visits to Free Fire player"
    }
  },

  onStart: async function({ api, event, args, message }) {
    const uid = args[0];

    if (!uid || isNaN(uid)) {
      return message.reply(
        "❌ Please provide a valid Free Fire UID.\n\nExample:\n/visit 2579249340"
      );
    }

    const url = `http://community-ffbd.vercel.app/visit?uid=${uid}`;

    try {
      const res = await axios.get(url);
      const d = res.data;

      if (d?.message) {
        return message.reply(
`⭐ **Views Sent Sucessfully** ⭐
✅ ${d.message}

🔥 ℹ️ **Re-Start** Your Game to Check the Visit Counts in Your Profile! 🫠`
        );
      } else {
        return message.reply(
          `⚠️ Unexpected API response:\n${JSON.stringify(d, null, 2)}`
        );
      }
    } catch (error) {
      return message.reply(
        `❌ Request failed!\nError: ${error.message}`
      );
    }
  }
};