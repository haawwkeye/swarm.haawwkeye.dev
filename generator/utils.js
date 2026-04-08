import fs from "node:fs/promises"

// TODO: Automate this
//* Most likely I'll either run a discord bot or just manually do this...
//* If I do it manually it will only contain the most recent and not keep old stuff....
//* But that should be fine! The main issue is if it updates I might not update right away....
//* Thus it is better to run a discord bot... Until it's auto posted somewhere... 
const Schedule = (await fs.readFile("./schedule.txt")).toString()

class ScheduleEvent {
	constructor(title, time) {
		this.title = title
		this.time = Number(time)
	}

	getEvent() {
		const ms = this.time * 1000;

		const startTime = new Date(ms)
		const endTime = new Date(ms)

		// TODO: Stream Length Detection
		//* Chill streams and Karaoke streams are about 2-3 hours
		//* Collab streams are about 3-4+ hours long sometimes more sometimes less
		//* So in theory I can just detect via the title or something idk
		endTime.setHours(endTime.getHours() + 2);
		endTime.setMinutes(endTime.getMinutes() + 30);

		return {
			id: ms,
			stamp: startTime.toUTCString(),
			start: startTime.toUTCString(),
			end: endTime.toUTCString(),
			summary: this.title,
			url: 'https://twitch.tv/vedal987',
		}
	}
}

function readScheduleLine(line) {
	const info = line.split(" - ");
	if (info[1].startsWith("Offline")) return false
	//console.log(event.title, event.time)
	return new ScheduleEvent((info[2].split("<")[0]).trim(), (info[1].split(":")[1]).trim())
}

export async function readSchedule()
{
	const schedule = [];
	Schedule.split("\n").forEach(line => {
		if (line.startsWith("<t:")) schedule.push(line)
	})
	
	const events = [];
	for (let i = 0; i < schedule.length; i++) {
		const info = schedule[i];
		let event = readScheduleLine(info);
		if (event) events.push(event)
	}
	return events;
}
