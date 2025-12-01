const mal = require("mal-scraper");

module.exports = {
	config: {
		name: "anime",
		version: "1.1",
		author: "Bhau",
		countDown: 10,
		role: 0,
		shortDescription: "Get anime details",
		longDescription: {
			en: "Fetch anime details from MyAnimeList."
		},
		category: "media",
		guide: {
			en: "{pn} <anime_name>\n\nExample:\n  {pn} naruto"
		}
	},

	onStart: async function ({ args, message }) {
		if (!args[0]) {
			return message.reply("❌ | Please provide an anime name.");
		}

		const title = args.join(" ");

		try {
			const animeInfo = await mal.getInfoFromName(title);

			if (!animeInfo) {
				return message.reply("❌ | No details found for this anime.");
			}

			const genres = animeInfo.genres && animeInfo.genres.length > 0
				? animeInfo.genres.join(", ")
				: "None";

			const producers = animeInfo.producers && animeInfo.producers.length > 0
				? animeInfo.producers.join(", ")
				: "None";

			const studios = animeInfo.studios && animeInfo.studios.length > 0
				? animeInfo.studios.join(", ")
				: "None";

			const responseMsg = `🎥 **Anime Details** 🎥\n\n` +
				`📌 **Title:** ${animeInfo.title}\n` +
				`📝 **Description:** ${animeInfo.synopsis || "No description available."}\n` +
				
				`🇯🇵 **Japanese Title:** ${animeInfo.japaneseTitle || "N/A"}\n` +
				`🎬 **Type:** ${animeInfo.type || "N/A"}\n` +
				`📊 **Status:** ${animeInfo.status || "N/A"}\n` +
				`📅 **Premiered:** ${animeInfo.premiered || "N/A"}\n` +
				`⏰ **Broadcast:** ${animeInfo.broadcast || "N/A"}\n` +
				`📆 **Aired:** ${animeInfo.aired || "N/A"}\n` +
				`🏭 **Producers:** ${producers}\n` +
				`🎞️ **Studios:** ${studios}\n` +
				`📚 **Source:** ${animeInfo.source || "N/A"}\n` +
				`🎥 **Episodes:** ${animeInfo.episodes || "N/A"}\n` +
				`⏳ **Duration:** ${animeInfo.duration || "N/A"}\n` +
				`🎭 **Genres:** ${genres}\n` +
				`🔥 **Popularity:** ${animeInfo.popularity || "N/A"}\n` +
				`🏆 **Ranked:** ${animeInfo.ranked || "N/A"}\n` +
				`⭐ **Score:** ${animeInfo.score || "N/A"}\n` +
				`🔞 **Rating:** ${animeInfo.rating || "N/A"}\n` +
				
				`📈 **Score Stats:** ${animeInfo.scoreStats || "N/A"}\n` +
				`👥 **Members:** ${animeInfo.members || "N/A"}\n` +
				`❤️ **Favorites:** ${animeInfo.favorites || "N/A"}\n` +
				`🔗 **More Info:** [MyAnimeList](${animeInfo.url})\n\n` +
				`👤 **API BY:**MUEID MURSALIN RIFAT`;

			return message.reply({
				body: responseMsg,
				attachment: await global.utils.getStreamFromURL(animeInfo.picture)
			});
		} catch (error) {
			console.error(error);
			return message.reply("❌ | Failed to fetch anime details. Please try again.");
		}
	}
};
