import ical, { ICalCalendarMethod, ICalAlarm, ICalAlarmType } from 'ical-generator';
import fs from "node:fs/promises"
import { readSchedule } from "./utils.js";

const calendar = ical({ name: 'Neuro Schedule' });
calendar.method(ICalCalendarMethod.REQUEST);

const FULL_DAY = 86400;

const data = await readSchedule()

function AddAlarm(armEvent) {
	// 15 mins
	armEvent.createAlarm({
		type: ICalAlarmType.audio,
		trigger: 60 * 15
	})
	// 2 mins
	armEvent.createAlarm({
		type: ICalAlarmType.audio,
		trigger: 60 * 2
	})
}

function CreateRepeating(title, time)
{
	const ms = time * 1000;
	const startTime = new Date(ms);
	const endTime = new Date(ms);

	endTime.setHours(endTime.getHours() + 2);
	endTime.setMinutes(endTime.getMinutes() + 30);

	const armEvent = calendar.createEvent({
		id: ms,
		stamp: startTime.toUTCString(),
		start: startTime.toUTCString(),
		end: endTime.toUTCString(),
		summary: title,
		url: 'https://twitch.tv/vedal987',
		repeating: {
			freq: 'WEEKLY'
		}
	})
	AddAlarm(armEvent)
}

data.events.forEach(event => {
	const armEvent = calendar.createEvent(event.getEvent())
	AddAlarm(armEvent)
})

// Repeating streams!!!! aka streams that should always be there unless the schedule says otherwise
if (data.lastDay != undefined)
{
	const isoString = new Date(data.lastDay * 1000).toISOString();
	const monday = Date.parse(`${isoString.split("T")[0]}T18:00:00.000Z`) / 1000
	const tuesday = monday + FULL_DAY
	const thursday = monday + (FULL_DAY * 3)

	CreateRepeating("Neuro Stream", tuesday)
	CreateRepeating("Evil Stream", thursday)
}


await fs.writeFile("../schedule.ics", calendar.toString())
await fs.writeFile("../schedule.json", JSON.stringify(calendar.toJSON(), null, 4))
