const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const dbPath = path.join(__dirname, "cache", "tempmail_users.json");

module.exports = {
  config: {
    name: "tempmail",
    aliases: ["tmail"],
    version: "2.0.0",
    author: "Bhau",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate a temp email and check your inbox"
    },
    longDescription: {
      en: "Easily create a temporary email address and view received messages using this command"
    },
    category: "utility",
    guide: {
      en: "{prefix}tempmail create - Generate a temporary email\n{prefix}tempmail inbox - View your inbox"
    }
  },

  onStart: async function ({ event, api, args }) {
    const subCmd = args[0];
    const userID = event.senderID;

    if (!subCmd)
      return api.sendMessage("❗ Please specify an action: 'create' or 'inbox'.", event.threadID, event.messageID);

    await fs.ensureFile(dbPath);
    let db = await fs.readJson(dbPath).catch(() => ({}));

    if (subCmd === "create") {
      try {
        const res = await axios.get("https://api.tempmail.lol/generate");
        const { address, id } = res.data;

        db[userID] = { address, id };
        await fs.writeJson(dbPath, db);

        return api.sendMessage(
          `✅ Your temporary email has been created:\n\n${address}\n\nUse '{prefix}tempmail inbox' to view incoming messages.`,
          event.threadID, event.messageID
        );
      } catch (err) {
        console.error(err);
        return api.sendMessage("⚠️ Unable to create temp email at the moment. Please try again later.", event.threadID, event.messageID);
      }
    }

    if (subCmd === "inbox") {
      const userData = db[userID];
      if (!userData)
        return api.sendMessage("ℹ️ You haven't generated a temp email yet. Use '{prefix}tempmail create' first.", event.threadID, event.messageID);

      const { address, id } = userData;

      try {
        const res = await axios.get(`https://api.tempmail.lol/mail/${id}`);
        const inbox = res.data;

        if (!Array.isArray(inbox) || inbox.length === 0)
          return api.sendMessage(`📭 Your inbox for ${address} is currently empty.`, event.threadID, event.messageID);

        const messages = inbox.map((msg, i) => 
          `${i + 1}. From: ${msg.from}\nSubject: ${msg.subject}\nTime: ${msg.date}\n\n${msg.body}`
        ).join("\n\n------------------------------\n\n");

        await api.sendMessage(`📥 Messages for ${address}:\n\n${messages}`, event.threadID, event.messageID);

        // Optionally remove the email after checking inbox
        delete db[userID];
        await fs.writeJson(dbPath, db);

      } catch (err) {
        console.error(err);
        return api.sendMessage("⚠️ Failed to retrieve inbox. Please try again later.", event.threadID, event.messageID);
      }
    } else {
      return api.sendMessage("❓ Unknown subcommand. Please use either 'create' or 'inbox'.", event.threadID, event.messageID);
    }
  }
};