const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notice", "noti"],
		version: "2.0",
		author: "Bhau",
		countDown: 5,
		role: 2,
		description: {
			en: "Send a broadcast notification from the admin to all group chats."
		},
		category: "owner",
		guide: {
			en: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		en: {
			missingMessage: "Please provide the message you'd like to broadcast to all groups.",
			notification: "ADMIN MASSAGE",
			sendingNotification: "Preparing to broadcast your message to %1 group(s)...",
			sentNotification: "✅ Successfully delivered the notification to %1 group(s).",
			errorSendingNotification: "⚠️ Failed to deliver to %1 group(s) due to the following error(s):\n%2"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];

		if (!args[0])
			return message.reply(getLang("missingMessage"));

		const formSend = {
			body: `${getLang("notification")}\n★★★★★★★★\n${args.join(" ")}`,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
			)
		};

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
		message.reply(getLang("sendingNotification", allThreadID.length));

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				const { errorDescription } = e;
				const existing = sendError.find(item => item.errorDescription == errorDescription);
				if (existing)
					existing.threadIDs.push(sended.threadID);
				else
					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});
			}
		}

		let msg = "";
		if (sendSucces > 0)
			msg += getLang("sentNotification", sendSucces) + "\n";
		if (sendError.length > 0)
			msg += getLang(
				"errorSendingNotification",
				sendError.reduce((a, b) => a + b.threadIDs.length, 0),
				sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n   + ${b.threadIDs.join("\n   + ")}`, "")
			);
		message.reply(msg);
	}
};