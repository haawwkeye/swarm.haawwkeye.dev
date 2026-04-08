import fs from "node:fs/promises"

const ExampleSchedule = (await fs.readFile("./example.txt")).toString()

class ScheduleEvent {
	constructor(title, time) {
		this.title = title
		this.time = Number(time)
	}

	createEvent(calendar) {
		const startTime = new Date(this.time * 1000)
		const endTime = new Date()
		endTime.setHours(startTime.getHours() + 2);
		endTime.setMinutes(startTime.getMinutes() + 30);

		calendar.createEvent({
			stamp: startTime.toUTCString(),
			start: startTime.toUTCString(),
			end: endTime.toUTCString(),
			summary: this.title,
			url: 'https://twitch.tv/vedal987',
		});
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
	ExampleSchedule.split("\n").forEach(line => {
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
