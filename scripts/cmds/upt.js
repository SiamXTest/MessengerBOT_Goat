const fs = require('fs').promises;
const os = require('os');
const moment = require('moment-timezone');
const nodeDiskInfo = require('node-disk-info');

module.exports = {
    config: {
        name: "upt",
        version: "1.0.2",
        author: "Bhau",
        countDown: 5,
        role: 0,
        description: {
            en: "Display full system and bot info with style.",
        },
        category: "utility",
        guide: {}
    },

    langs: {
        en: {}
    },

    onStart: async function ({ api, event }) {
        const startTime = Date.now();

        // Typing animation setup
        const loadingSteps = [
            "⏳ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼,",
            "⏳ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼,\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁",
            "⏳ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼,\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 .",
            "⏳ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼,\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 ..",
            "⏳ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼,\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 ..."
        ];

        const loadingMsg = await api.sendMessage(loadingSteps[0], event.threadID);
        for (let i = 1; i < loadingSteps.length; i++) {
            await new Promise(res => setTimeout(res, 500));
            await api.editMessage(loadingSteps[i], loadingMsg.messageID, event.threadID);
        }

        // Helper functions
        async function getDependencyCount() {
            try {
                const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
                return Object.keys(packageJson.dependencies).length;
            } catch {
                return -1;
            }
        }

        function getStatusByPing(ping) {
            if (ping < 200) return '⚡ Excellent';
            if (ping < 800) return '⚠️ Moderate';
            return '🐢 Slow';
        }

        function getPrimaryIP() {
            const interfaces = os.networkInterfaces();
            for (const iface of Object.values(interfaces)) {
                for (const alias of iface) {
                    if (alias.family === 'IPv4' && !alias.internal) {
                        return alias.address;
                    }
                }
            }
            return '127.0.0.1';
        }

        function formatUptime(uptime) {
            const h = Math.floor(uptime / 3600);
            const m = Math.floor((uptime % 3600) / 60);
            const s = Math.floor(uptime % 60);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        function convertToGB(bytes) {
            return bytes ? (bytes / (1024 ** 3)).toFixed(2) + ' GB' : 'N/A';
        }

        try {
            const uptime = formatUptime(process.uptime());
            const dependencyCount = await getDependencyCount();
            const ping = Date.now() - startTime;
            const status = getStatusByPing(ping);

            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;

            const disks = await nodeDiskInfo.getDiskInfo();
            const disk = disks[0] || { blocks: 0, available: 0, used: 0 };

            const userInfo = await api.getUserInfo(event.senderID);
            const userName = userInfo[event.senderID]?.name || "Unknown User";
            const now = moment().tz('Asia/Dhaka').format('HH:mm:ss | DD/MM/YYYY');

            const message = `
╭━━━[ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ]━━━╮
┃ 🕐 𝗧𝗶𝗺𝗲           : ${now}
┃ ⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲         : ${uptime}
┃ 📦 𝗗𝗲𝗽𝗲𝗻𝗱𝗲𝗻𝗰𝗶𝗲𝘀  : ${dependencyCount >= 0 ? dependencyCount : 'Unknown'}
┃ ⚙️ 𝗣𝗲𝗿𝗳𝗼𝗿𝗺𝗮𝗻𝗰𝗲    : ${status} (${ping}ms)
┃
┃ 🖥️ 𝗢𝗦             : ${os.type()} ${os.release()} (${os.arch()})
┃ 🧠 𝗖𝗣𝗨            : ${os.cpus().length} Core(s)
┃                  ↳ ${os.cpus()[0].model} @ ${Math.round(os.cpus()[0].speed)}MHz
┃
┃ 📊 𝗥𝗔𝗠 𝗨𝘀𝗲𝗱       : ${(usedMem / 1024 ** 3).toFixed(2)} / ${(totalMem / 1024 ** 3).toFixed(2)} GB
┃ 🛢️ 𝗙𝗿𝗲𝗲 𝗥𝗔𝗠      : ${(freeMem / 1024 ** 3).toFixed(2)} GB
┃ 💽 𝗗𝗶𝘀𝗸 𝗨𝘀𝗲𝗱     : ${convertToGB(disk.used)} / ${convertToGB(disk.blocks)}
┃ 📂 𝗙𝗿𝗲𝗲 𝗦𝘁𝗼𝗿𝗮𝗴𝗲 : ${convertToGB(disk.available)}
┃ 🌐 𝗣𝗿𝗶𝗺𝗮𝗿𝘆 𝗜𝗣     : ${getPrimaryIP()}
┃ 🙋 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆   : ${userName}
┃ 🧑‍💻 𝗔𝘂𝘁𝗵𝗼𝗿        : Mueid Mursalin Rifat
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

            await api.editMessage(message, loadingMsg.messageID, event.threadID);
        } catch (err) {
            console.error('❎ Error:', err.message);
            return api.sendMessage(`❎ 𝗘𝗿𝗿𝗼𝗿: ${err.message}`, event.threadID, event.messageID);
        }
    }
};
