import ical, { ICalCalendarMethod, ICalAlarm, ICalAlarmType } from 'ical-generator';
import fs from "node:fs/promises"
import { readSchedule } from "./utils.js";

const calendar = ical({ name: 'Neuro Schedule' });
calendar.method(ICalCalendarMethod.REQUEST);

const events = await readSchedule()

// TODO: Look into this, as it doesn't work at all for some reason???
//* Could just be from not doing it correctly on iphone???
events.forEach(event => {
	const armEvent = calendar.createEvent(event.getEvent())
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
})

await fs.writeFile("../schedule.ics", calendar.toString())
await fs.writeFile("../schedule.json", JSON.stringify(calendar.toJSON(), null, 4))
