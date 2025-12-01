const axios = require("axios");
const fs = require("fs");
const https = require("https");

function formatDate(ts) {
  if (!ts) return "N/A";
  const date = new Date(parseInt(ts) * 1000);
  return date.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
}

module.exports = {
  config: {
    name: "get",
    version: "2.2",
    author: "Bhau",
    countDown: 5,
    role: 0,
    description: {
      en: "Free Fire full account info using UID and outfit image"
    },
    category: "game",
    guide: {
      en: "{pn} <uid> - Get Free Fire player info"
    }
  },

  onStart: async function({ api, event, args, message }) {
    const uid = args[0];
    if (!uid) return message.reply("❌ Please Provide Uid\n\nUsages:\n/get <uid>");

    try {
      const { data } = await axios.get(`https://bhauxinfo2.vercel.app/bhau?uid=${uid}&region=BD`);
      if (!data?.basicInfo) return message.reply("❌ User Not Found! Please Check Uid.");

      const {
        nickname, region, level, exp, liked, rank, csRank, badgeCnt, maxRank, csMaxRank, releaseVersion,
        bannerId, headPic, pinId, title, weaponSkinShows, badgeId, seasonId, createAt, lastLoginAt,
        showBrRank, showCsRank, externalIconInfo, rankingPoints, csRankingPoints, accountType
      } = data.basicInfo;

      const profile = data.profileInfo || {};
      const clan = data.clanBasicInfo || {};
      const captain = data.captainBasicInfo || {};
      const pet = data.petInfo || {};
      const social = data.socialInfo || {};
      const diamondCost = data.diamondCostRes?.diamondCost || 0;
      const creditScore = data.creditScoreInfo?.creditScore || "N/A";
      const creditEnd = data.creditScoreInfo?.periodicSummaryEndTime;

      const msg =
`ACCOUNT INFO:
┌ 👤 ACCOUNT BASIC INFO
├─ Name: ${nickname}
├─ UID: ${uid}
├─ Level: ${level} (Exp: ${exp})
├─ Region: ${region}
├─ Likes: ${liked}
├─ Honor Score: ${creditScore}
├─ Celebrity Status: ${externalIconInfo?.status || "False"}
├─ Evo Access Badge: ${badgeId || "N/A"}
└─ Signature: ${social.signature || "—"}

┌ 🎮 ACCOUNT ACTIVITY
├─ Most Recent OB: ${releaseVersion || "N/A"}
├─ Fire Pass: N/A
├─ Current BP Badges: ${badgeCnt || "N/A"}
├─ Account Type: ${accountType || "N/A"}
├─ BR Rank: ${rank} (Max: ${maxRank || "N/A"}) - Points: ${rankingPoints || "N/A"}
├─ CS Rank: ${csRank} (Max: ${csMaxRank || "N/A"}) - Points: ${csRankingPoints || "N/A"}
├─ Created At: ${formatDate(createAt)}
└─ Last Login: ${formatDate(lastLoginAt)}

┌ 👕 ACCOUNT OVERVIEW
├─ Avatar & Banner: AvatarID=${headPic}, BannerID=${bannerId}
├─ Skin Color: ${profile.skinColor || "N/A"}
├─ Clothes: ${profile.clothes?.join(", ") || "N/A"}
├─ Equipped Skills: ${profile.equipedSkills?.join(", ") || "N/A"}
└─ Avatar Unlock Type: ${profile.unlockType || "N/A"}

┌ 🐾 PET DETAILS
├─ Equipped?: ${pet.id ? "Yes" : "No"}
├─ Pet ID: ${pet.id || "N/A"}
├─ Pet Skin ID: ${pet.skinId || "N/A"}
├─ Pet Exp: ${pet.exp || "N/A"}
├─ IsSelected: ${pet.isSelected || "N/A"}
├─ Pet Level: ${pet.level || "N/A"}
└─ Selected Skill ID: ${pet.selectedSkillId || "N/A"}

┌ 🛡️ GUILD INFO
├─ Guild Name: ${clan.clanName || "N/A"}
├─ Guild ID: ${clan.clanId || "N/A"}
├─ Guild Level: ${clan.clanLevel || "N/A"}
├─ Guild Capacity: ${clan.capacity || "N/A"}
├─ Live Members: ${clan.memberNum || "N/A"}
└─ Leader Info:
 ├─ Leader Name: ${captain.nickname || "N/A"}
 ├─ Leader UID: ${clan.captainId || "N/A"}
 ├─ Leader Level: ${captain.level || "N/A"} (Exp: ${captain.exp || "N/A"})
 ├─ Leader Title: ${captain.title || "N/A"}
 ├─ Leader Current BP Badges: ${captain.badgeCnt || "N/A"}
 ├─ Leader BR Rank: ${captain.rank || "N/A"} - Points: ${captain.rankingPoints || "N/A"}
 └─ Leader CS Rank: ${captain.csRank || "N/A"}

┌ 🛠️ EXTRA INFO
├─ Release Version: ${releaseVersion || "N/A"}
├─ Show BR Rank: ${showBrRank}
├─ Show CS Rank: ${showCsRank}
├─ Social Mode Prefer: ${social.modePrefer || "N/A"}
├─ Gender: ${social.gender || "N/A"}
└─ External Icon Info:
 ├─ Status: ${externalIconInfo?.status || "N/A"}
 └─ Show Type: ${externalIconInfo?.showType || "N/A"}

━━━━━━━━━━━━━━━
👑 Owner: Siam Bhau`;

      message.reply(msg, async (err, info) => {
        if (err) return;

        const imgUrl = `https://bhauxoutfits2.vercel.app/outfit?key=SiamBhau&uid=${uid}`;
        const path = __dirname + `/cache/outfit_${uid}.png`;
        const file = fs.createWriteStream(path);

        https.get(imgUrl, response => {
          response.pipe(file);
          file.on("finish", () => {
            file.close(() => {
              api.sendMessage({
                body: "🧥 𝗣𝗹𝗮𝘆𝗲𝗿 𝗢𝘂𝘁𝗳𝗶𝘁:",
                attachment: fs.createReadStream(path)
              }, event.threadID, () => {
                fs.unlinkSync(path);
              }, info.messageID);
            });
          });
        }).on("error", err => {
          console.log("Outfit Image Error:", err.message);
          try {
            fs.unlinkSync(path);
          } catch(e) {}
        });
      });

    } catch (err) {
      console.log(err.message);
      return message.reply("❌ There was a problem retrieving information from the server.");
    }
  }
};