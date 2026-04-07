import ical, { ICalCalendarMethod } from 'ical-generator';
import fs from "node:fs/promises"

const calendar = ical({ name: 'my first iCal' });

calendar.method(ICalCalendarMethod.REQUEST);

const startTime = new Date();
const endTime = new Date();
endTime.setHours(startTime.getHours() + 1);
calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: 'Example Event',
    description: 'test',
    location: 'stream',
    url: 'http://twitch.tv/vedal987',
});

await fs.writeFile("../schedule.ics", calendar.toString())
await fs.writeFile("../schedule.json", JSON.stringify(calendar.toJSON(), null, 4))
