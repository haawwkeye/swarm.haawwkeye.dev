import ical, { ICalCalendarMethod } from 'ical-generator';
import fs from "node:fs/promises"
import { readSchedule } from "./utils.js";

const calendar = ical({ name: 'Neuro Schedule' });
calendar.method(ICalCalendarMethod.REQUEST);

const events = await readSchedule()

calendar.createEvent({
	stamp
})

events.forEach(event => event.createEvent(calendar))

await fs.writeFile("../schedule.ics", calendar.toString())
await fs.writeFile("../schedule.json", JSON.stringify(calendar.toJSON(), null, 4))
