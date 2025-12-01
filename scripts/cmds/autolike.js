const axios = require("axios");
const cron = require("node-cron");
const moment = require("moment-timezone");

let uidList = [
  "1629063648",
  "1622140199", 
  "3518034960",
  "6201276150",
  "2980557382",
  "13187219703",
  "13249963743",
  "12961029544",
  "6163548591",
  "2028498456",
  "3546997884",
  "3443612647",
  "8921789202",
  "2730450215",
  "3224878512",
  "13594940054",
  "736520309",
  "358099099",
  "2119155031",
  "300322905",
  "834518446"
];

let scheduleTime = "10:00 AM";

const adminUIDs = [
  "100011254804801",
  "1234567890"
];

const API_BASE = "https://bhauxlike3.vercel.app/like";
const INFO_API_BASE = "https://bhauxinfo2.vercel.app/bhau";

module.exports = {
  config: {
    name: "autolike",
    version: "3.3.0",
    author: "Bhau",
    countDown: 5,
    role: 2,
    description: {
      en: "Free Fire Auto Like (UID list + Auto-start + Test Like)"
    },
    category: "admin",
    guide: {
      en: "{pn} help - Show all commands\n{pn} list - Show UID list\n{pn} add <UID> - Add UID\n{pn} remove <UID> - Remove UID\n{pn} settime <hh:mm AM/PM> - Set schedule time\n{pn} status - Check status\n{pn} test <UID> - Test like\n{pn} runnow - Run manually\n{pn} crontest - Check cron status"
    }
  },

  onStart: async function({ api, event, args, message }) {
    if (!adminUIDs.includes(event.senderID)) {
      return message.reply("🚫 Only Admin Can Use this Command");
    }

    const sub = args[0] ? args[0].toLowerCase() : "help";

    if (sub === "help") {
      return message.reply(
        `📌 AutoLike Commands:\n• autolike help\n• autolike list\n• autolike add <UID>\n• autolike remove <UID>\n• autolike settime <hh:mm AM/PM>\n• autolike status\n• autolike test <UID>\n• autolike runnow\n• autolike crontest\n\n⚠️ AutoLike runs automatically at ${scheduleTime} everyday.`
      );
    }

    if (sub === "list") {
      if (uidList.length === 0) return message.reply("❌ UID list is empty.");

      let listText = "📋 UID List:\n\n";
      for (let uid of uidList) {
        const name = await getPlayerInfo(uid);
        if (name) {
          listText += `${uid}:${name}\n`;
        } else {
          listText += `${uid}:Unknown\n`;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      return message.reply(listText);
    }

    if (sub === "add") {
      const uid = args[1];
      if (!uid) return message.reply("Usage: autolike add <UID>");
      if (uidList.includes(uid)) return message.reply("❌ UID already exists.");
      uidList.push(uid);
      return message.reply(`✅ UID ${uid} added.`);
    }

    if (sub === "remove") {
      const uid = args[1];
      if (!uid) return message.reply("Usage: autolike remove <UID>");
      uidList = uidList.filter((u) => u !== uid);
      return message.reply(`🗑️ UID ${uid} removed.`);
    }

    if (sub === "settime") {
      if (!args[1] || !args[2]) return message.reply("Usage: autolike settime <hh:mm AM/PM>");
      scheduleTime = args[1] + " " + args[2].toUpperCase();
      return message.reply(`⏰ Time set to ${scheduleTime}. Please restart bot to apply changes.`);
    }

    if (sub === "status") {
      return message.reply(
        `ℹ️ AutoLike Status:\n✅ Always Running\n📋 Total UIDs: ${uidList.length}\n⏰ Schedule: ${scheduleTime} (Dhaka Time)`
      );
    }

    if (sub === "runnow") {
      message.reply("🚀 Running AutoLike manually...");
      await runAutoLike((msg) => message.reply(msg));
      return;
    }

    if (sub === "crontest") {
      const dhakaTime = moment().tz("Asia/Dhaka");
      return message.reply(
        `🕐 Current Time Check:\n⏰ Dhaka Time: ${dhakaTime.format("hh:mm:ss A")}\n📅 Date: ${dhakaTime.format("YYYY-MM-DD")}\n⚙️ Scheduled Time: ${scheduleTime}\n✅ Cron is ${cron ? 'ACTIVE' : 'INACTIVE'}`
      );
    }

    if (sub === "test") {
      const uid = args[1];
      if (!uid) return message.reply("Usage: autolike test <UID>");

      message.reply(`⏳ Sending test like to UID: ${uid}...`);

      const result = await sendLike(uid);

      if (result.success && result.data.status === 1) {
        return message.reply(
          `✅ Test Like Sent! 🎉\n\n👤 Player Name: ${result.data.PlayerNickname}\n🆔 UID: ${result.data.UID}\n\n❤️ Likes Before: ${result.data.LikesbeforeCommand}\n💖 Likes Given: ${result.data.LikesGivenByAPI}\n🎯 Total Likes Now: ${result.data.LikesafterCommand}`
        );
      } else if (result.success && result.data.status === 2) {
        return message.reply(
          `👤 Player Name: ${result.data.PlayerNickname}\n👍 Current Likes: ${result.data.LikesafterCommand}\n\n⚠️ This Player Already Got Maximum Likes For Today.`
        );
      } else {
        return message.reply(`❌ Error UID ${uid} | ${result.error || "Unknown error"}`);
      }
    }

    return message.reply('❓ Unknown subcommand. Try "autolike help"');
  },

  onLoad: function({ api }) {
    const sendMessage = (msg) => {
      console.log("AutoLike:", msg);
      adminUIDs.forEach(uid => {
        try {
          api.sendMessage(msg, uid);
        } catch (err) {
          console.error(`Failed to send to admin ${uid}:`, err.message);
        }
      });
    };

    console.log("🎯 AutoLike initialized with API and messaging");
    initAutoLike(sendMessage);
  }
};

async function sendLike(uid) {
  try {
    const url = `${API_BASE}?uid=${encodeURIComponent(uid)}&key=SiamBhau`;
    const res = await axios.get(url, { timeout: 15000 });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message || err.toString() };
  }
}

async function getPlayerInfo(uid, region = "BD") {
  try {
    const url = `${INFO_API_BASE}?uid=${encodeURIComponent(uid)}&region=${region}`;
    const res = await axios.get(url, { timeout: 10000 });
    if (res.data && res.data.basicInfo && res.data.basicInfo.nickname) {
      return res.data.basicInfo.nickname;
    }
    return null;
  } catch (err) {
    return null;
  }
}

function convertTo24h(time12h) {
  let [time, meridian] = time12h.split(" ");
  if (!meridian) return { hours: 0, minutes: 0 };
  let [hours, minutes] = time.split(":").map(Number);
  if (meridian.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

async function runAutoLike(sendMessage) {
  console.log("🚀 AutoLike Running at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));

  for (let uid of uidList) {
    const result = await sendLike(uid);

    if (result.success && result.data.status === 1) {
      sendMessage(
        `✅ Auto Likes Sent Successfully! 🎉\n\n👤 Player Name: ${result.data.PlayerNickname}\n🆔 UID: ${result.data.UID}\n\n❤️ Likes Before: ${result.data.LikesbeforeCommand}\n💖 Likes Given: ${result.data.LikesGivenByAPI}\n🎯 Total Likes Now: ${result.data.LikesafterCommand}`
      );
    } else if (result.success && result.data.status === 2) {
      sendMessage(
        `👤 Player Name: ${result.data.PlayerNickname}\n👍 Current Likes: ${result.data.LikesafterCommand}\n\n⚠️ This Player Already Got Maximum Likes For Today.`
      );
    } else {
      sendMessage(`❌ Error UID ${uid} | ${result.error || "Unknown error"}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }
}

function initAutoLike(sendMessage) {
  const { hours, minutes } = convertTo24h(scheduleTime);
  const cronExpr = `${minutes} ${hours} * * *`;

  console.log("✅ AutoLike Initialized");
  console.log("🕒 Cron Expression:", cronExpr);
  console.log("⏰ Schedule Time:", scheduleTime, "(Dhaka Time)");
  console.log("⏱️  Current Dhaka Time:", moment().tz("Asia/Dhaka").format("hh:mm A"));

  const task = cron.schedule(cronExpr, () => {
    console.log("🔔 Cron triggered at:", moment().tz("Asia/Dhaka").format("YYYY-MM-DD hh:mm:ss A"));
    runAutoLike(sendMessage);
  }, {
    scheduled: true,
    timezone: "Asia/Dhaka"
  });

  console.log("✅ Cron task scheduled successfully!");

  setTimeout(() => {
    console.log("🔍 Cron status check - Next run will be at:", scheduleTime);
  }, 2000);
}