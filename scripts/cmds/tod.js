const axios = require("axios");

module.exports = {
  config: {
    name: "truthordare",
    aliases: ["tod", "tord"],
    version: "1.0",
    author: "Bhau",
    countDown: 5,
    role: 0,
    shortDescription: "Get a random Truth or Dare challenge.",
    longDescription: "Fetches a random Truth or Dare question from an external API. Use: truth, dare, t, d",
    category: "game",
    guide: {
      en: "{pn} [truth | t | dare | d]"
    }
  },

  onStart: async function ({ message, args }) {
    const emojis = ["😶", "🫡", "🙃", "😳", "😃", "😺", "🤐", "🫠", "💀", "🙂"];
    const type = (args[0] || "").toLowerCase();

    let url;
    if (["t", "truth"].includes(type)) {
      url = "https://truthordare-mmr.onrender.com/truth";
    } else if (["d", "dare"].includes(type)) {
      url = "https://truthordare-mmr.onrender.com/dare";
    } else {
      return message.reply(`❓ Usage:
• {pn} t or {pn} truth → Get a Truth
• {pn} d or {pn} dare → Get a Dare`);
    }

    try {
      const res = await axios.get(url);
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      const replyText = type.startsWith("t")
        ? `🟢 𝗧𝗿𝘂𝘁𝗵:\n${res.data.question} ${emoji}`
        : `🔴 𝗗𝗮𝗿𝗲:\n${res.data.challenge} ${emoji}`;

      return message.reply(replyText);
    } catch (err) {
      return message.reply("❌ Failed to fetch challenge. Please try again later.");
    }
  }
};