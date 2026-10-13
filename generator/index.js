import ical, { ICalCalendarMethod, ICalAlarm, ICalAlarmType } from 'ical-generator';
import fs from "node:fs/promises"
import { readSchedule } from "./utils.js";

const calendar = ical({ name: 'Neuro Schedule' });
calendar.method(ICalCalendarMethod.REQUEST);

class Event {
	constructor(title, startTime, endTime) {
		this.Title = title;
		this.StartTime = startTime;
		this.EndTime = endTime;
	}
}

const FULL_DAY = 86400;

// Early Start?
// (based only on first day, Might change to 12 and just wake up early if it doesn't continue)
const SpecialEvent = new Event("The Long Drive Marathon 🚗", (date) => {
	date.setHours(11, 0, 0, 0);
}, (date) => {
	date.setHours(21, 0, 0, 0);
})//, "11:30:00.000", "21:00:00.000")

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

function CreateRepeating(title, _startTime, _endTime)
{
	const hasEndTime = _endTime != null;
	if (_endTime == null) _endTime = _startTime; // null check or whatever...

	const startMS = _startTime * 1000;
	const endMS = _endTime * 1000;

	const startTime = new Date(startMS);
	const endTime = new Date(endMS);

	if (!hasEndTime)
	{
		endTime.setHours(endTime.getHours() + 2);
		endTime.setMinutes(endTime.getMinutes() + 30);
	}

	const armEvent = calendar.createEvent({
		id: startMS,
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
	// Remove the event (This might change later once schedules actually get posted)
	// Just removes dupes
	if (SpecialEvent && event.fullTitle.includes(SpecialEvent.Title)) return;
	const armEvent = calendar.createEvent(event.getEvent())
	AddAlarm(armEvent)
})

// TODO: Switch how I handle time
// I will keep this for now until I know more info on if streams like this will happen or not
// Repeating streams!!!! aka streams that should always be there unless the schedule says otherwise
if (data.lastDay != undefined)
{
	const nextDay = () => new Date(data.lastDay * 1000);

	//const isoString = nextDay.toISOString();

	if (SpecialEvent) {
		const startDate = nextDay()
		const endDate = nextDay()

		SpecialEvent.StartTime(startDate);
		SpecialEvent.EndTime(endDate);

		const start_monday = startDate / 1000
		const start_tuesday = start_monday + FULL_DAY
		const start_wednesday = start_monday + (FULL_DAY * 2)
		const start_thursday = start_monday + (FULL_DAY * 3)
		const start_saturday = start_monday + (FULL_DAY * 4)
		const start_sunday = start_monday + (FULL_DAY * 5)

		const end_monday = endDate / 1000
		const end_tuesday = end_monday + FULL_DAY
		const end_wednesday = end_monday + (FULL_DAY * 2)
		const end_thursday = end_monday + (FULL_DAY * 3)
		const end_saturday = end_monday + (FULL_DAY * 4)
		const end_sunday = end_monday + (FULL_DAY * 5)

		CreateRepeating(SpecialEvent.Title, start_monday, end_monday);
		CreateRepeating(SpecialEvent.Title, start_tuesday, end_tuesday);
		CreateRepeating(SpecialEvent.Title, start_wednesday, end_wednesday);
		CreateRepeating(SpecialEvent.Title, start_thursday, end_thursday);
		CreateRepeating(SpecialEvent.Title, start_saturday, end_saturday);
		CreateRepeating(SpecialEvent.Title, start_sunday, end_sunday);
	} else {
		const startDate = nextDay()
		startDate.setHours(14,0,0,0);

		const monday = startDate / 1000;
		const tuesday = monday + FULL_DAY
		//const wednesday = monday + (FULL_DAY * 2)
		const thursday = monday + (FULL_DAY * 3)
		//const saturday = monday + (FULL_DAY * 4)
		//const sunday = monday + (FULL_DAY * 5)

		CreateRepeating("Neuro Stream", tuesday)
		CreateRepeating("Evil Stream", thursday)
	}
}


await fs.writeFile("../schedule.ics", calendar.toString())
await fs.writeFile("../schedule.json", JSON.stringify(calendar.toJSON(), null, 4))
