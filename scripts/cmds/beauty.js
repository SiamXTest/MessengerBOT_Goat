module.exports = {
  config: {
    name: "beauty",
    version: "1.3",
    author: "Bhau",
    role: 0,
    category: "fun",
    guide: {
      vi: "Just For Fun",
      en: "Get a fun beauty rating with reactions 🤩"
    }
  },

  onStart: async function ({ api, event }) {
    const uid = event.senderID;

    // If UID matches, force high beauty score
    const isSpecialUser = uid === "100051869042398";
    const percent = isSpecialUser
      ? Math.floor(Math.random() * 20) + 80 // Force between 80–99 or 100
      : Math.floor(Math.random() * 100) + 1;

    let message = "";

    if (percent <= 20) {
      const low = [
        `😬 Beauty Level: ${percent}%\nLet's say... you're beautiful on the inside 💔`,
        `😅 Only ${percent}% beautiful? Mirror must be glitching again!`,
        `😓 ${percent}%? It's okay, beauty is subjective (and blind sometimes)!`,
        `🥴 Beauty Level: ${percent}%. Don't worry, even potatoes are loved. 🥔`,
        `🤧 ${percent}% beautiful — but 100% lovable personality!`
      ];
      message = low[Math.floor(Math.random() * low.length)];
    } else if (percent <= 50) {
      const midLow = [
        `🙂 Beauty Level: ${percent}%\nHey, at least you're halfway to stunning!`,
        `🤔 ${percent}%? Not bad, not bad... but don’t quit your glow-up just yet!`,
        `😌 ${percent}% beautiful! You’ve got potential, superstar 🌟`,
        `🪞 Beauty Check: ${percent}%\nMaybe just a filter away! 😉`,
        `🎯 ${percent}% — More charm than looks, and that’s a win!`
      ];
      message = midLow[Math.floor(Math.random() * midLow.length)];
    } else if (percent <= 80) {
      const midHigh = [
        `😎 ${percent}% beautiful!\nYou've got that natural glow! ✨`,
        `🔥 ${percent}% — Someone alert the paparazzi 📸`,
        `😏 Beauty Level: ${percent}%\nConfidence looks good on you!`,
        `🌟 ${percent}%? Okay, you're officially crush material!`,
        `💃 ${percent}% — Model vibes activated! 💅`
      ];
      message = midHigh[Math.floor(Math.random() * midHigh.length)];
    } else if (percent < 100) {
      const high = [
        `😍 Woah! ${percent}% beauty? You're almost illegal 😳`,
        `🧨 ${percent}% — You're a walking photoshoot! 📷`,
        `💖 ${percent}% — Even mirrors be like “Dayumm!” 🔥`,
        `👑 ${percent}% — Royal-level attractiveness detected.`,
        `✨ ${percent}% — You must be photoshopped in real life!`
      ];
      message = high[Math.floor(Math.random() * high.length)];
    } else {
      const max = [
        `💘 Beauty Level: 100%\nOh. My. God. 🤯 Perfection overload!`,
        `⚠️ ALERT: 100% Beauty!\nToo hot to handle, system crashing... 💥`,
        `👼 100% Beautiful!\nAre you even real?! 😍`,
        `🌈 100% — You're the final boss of beauty 😎`,
        `🎉 100% — Cuteness limit exceeded. Take a bow, legend! 🙌`
      ];
      message = max[Math.floor(Math.random() * max.length)];
    }

    return api.sendMessage(message, event.threadID, event.messageID);
  }
};