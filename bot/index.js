import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { readFile, writeFile } from "node:fs/promises";

const ScheduleTxt = "../generator/schedule.txt";
const encoding = { encoding: "utf8" };

let currentSchedule = await readFile(ScheduleTxt, encoding);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent
	] 
});

function isScheduleFormat(content) {
	return content.includes("<t:") && content.includes(":F> - ") 
}

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (newMessage) => {
	const { channelId, content } = newMessage;

	if (channelId !== process.env.DISCORD_CHANNEL_ID) return;
	if (!isScheduleFormat(content)) return;
	//console.log(newMessage.content);
	await writeFile(ScheduleTxt, content, encoding);
});
client.on(Events.MessageUpdate, async (old, newMessage) => {
	const { channelId, content } = newMessage;

	if (channelId !== process.env.DISCORD_CHANNEL_ID) return;
	if (!isScheduleFormat(content)) return;
	//console.log(old.content);
	//console.log("---------");
	//console.log(newMessage.content);
	//console.log("Edited!");
	await writeFile(ScheduleTxt, content, encoding);
});

client.login(process.env.DISCORD_TOKEN)
