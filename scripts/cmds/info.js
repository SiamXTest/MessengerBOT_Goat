const moment = require('moment-timezone');

module.exports = {
        config: {
                name: "botinfo",
                aliases: ["info", "admininfo", "ownerinfo"],
                version: "2.0",
                author: "Bhau",
                countDown: 10,
                role: 0,
                shortDescription: { en: "Show detailed info about Siam Bhau bot & owner" },
                longDescription: { en: "Displays information such as bot name, prefix, owner name, uptime, and social media links." },
                category: "info",
                guide: { en: "{pn}" },
                envConfig: {}
        },

        onStart: async function ({ message }) {
                try {
                        const botName = "BhauXBOT";
                        const botPrefix = ".";
                        const authorName = "SiamBhau";
                        const authorFB = "https://facebook.com/SiamBhau69";
                        const authorTelegram = "t.me/SiamBhau";
                        const status = "✅ 𝘈𝘊𝘛𝘐𝘝𝘌 & 𝘙𝘌𝘚𝘗𝘖𝘕𝘋𝘐𝘕𝘎";

                        const now = moment().tz('Asia/Dhaka');
                        const date = now.format('dddd, MMMM Do YYYY');
                        const time = now.format('h:mm:ss A');

                        const uptime = process.uptime();
                        const days = Math.floor(uptime / (60 * 60 * 24));
                        const hours = Math.floor((uptime / (60 * 60)) % 24);
                        const minutes = Math.floor((uptime / 60) % 60);
                        const seconds = Math.floor(uptime % 60);
                        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                        message.reply(
`─── 〔 💫 𝗦𝗶𝗮𝗺 𝗕𝗵𝗮𝘂 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 💫 〕 ───

✨ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${botName}
🔗 𝗣𝗿𝗲𝗳𝗶𝘅: ${botPrefix}
👑 𝗢𝘄𝗻𝗲𝗿: ${authorName}
🆔 𝗦𝘁𝗮𝘁𝘂𝘀: ${status}

──────〔 📱 𝗦𝗢𝗖𝗜𝗔𝗟 𝗟𝗜𝗡𝗞𝗦 〕──────
🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${authorFB}
📱 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: ${authorTelegram}

─────〔 ⏳ 𝗧𝗜𝗠𝗘𝗦𝗧𝗔𝗧𝗘 〕─────
📅 𝗗𝗮𝘁𝗲: ${date}
⏰ 𝗧𝗶𝗺𝗲: ${time}
⚙️ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeString}

──────────────────────
💖 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗦𝗶𝗮𝗺 𝗕𝗵𝗮𝘂 𝗕𝗼𝘁! 
🛠️ 𝗠𝗮𝗱𝗲 𝘄𝗶𝘁𝗵 𝗹𝗼𝘃𝗲 𝗯𝘆 ${authorName}`
                        );
                } catch (error) {
                        console.error("Error in 'botinfo' command:", error);
                        message.reply("❌ Whoops! Something went wrong while fetching the bot info.");
                }
        },

        onChat: async function ({ event, message }) {
                if (event.body?.toLowerCase() === "siambhau") {
                        this.onStart({ message });
                }
        }
};
