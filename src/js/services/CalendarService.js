import request from 'superagent';
import moment from 'moment';

const isAvailableSlot = (slotStart, nextEvent, interviewDuration) => {
  const slotDuration = nextEvent - slotStart;
  const miliSecondsMargin = 1000;
  const hoursToMinutes = 60;
  const minutesToMiliSeconds = 60 * 1000;
  const currentHourInMinutes = interviewDuration.hour() * hoursToMinutes;
  const duration = (interviewDuration.minute() + currentHourInMinutes) * minutesToMiliSeconds;

  return (moment(slotStart).isBefore(nextEvent) &&
   (slotDuration + miliSecondsMargin >= duration));
};

const addSlot = (slots, start, end) => {
  const slot = {
    start,
    end,
  };
  slots.push(slot);
};

const processRequest = (events, start, end, duration) => {
  let slotStart = new Date(start);
  const endOfDay = new Date(end);
  const slots = [];

  events.forEach((event, i) => {
    const eventTime = new Date(event.start.dateTime);

    if (isAvailableSlot(slotStart, eventTime, duration)) {
      addSlot(slots, slotStart, eventTime);
    }

    slotStart = new Date(event.end.dateTime);
    if (i === (events.length - 1) && isAvailableSlot(slotStart, endOfDay, duration)) {
      addSlot(slots, slotStart, endOfDay);
    }
  });
  return slots;
};

const requestSingleAvailability = (token, workingDayStart, workingDayEnd,
  interviewDuration, email, processRequestFunct) => {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${email}/events`;

  const start = workingDayStart.toISOString();
  const end = workingDayEnd.toISOString();

  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .query({ singleEvents: 'true' })
      .query({ orderBy: 'startTime' })
      .query({ timeMin: start })
      .query({ timeMax: end })
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            email,
            data: processRequestFunct(res.body.items, start, end, interviewDuration),
          });
        }
      });
  });
};

const requestAvailability = ((token, workingDayStart, workingDayEnd,
  interviewDuration, listOfEmails) => {
  const promises = listOfEmails.map(email =>
    requestSingleAvailability(token, workingDayStart, workingDayEnd, interviewDuration, email, processRequest));
  return Promise.all(promises);
});

export default { requestAvailability, requestSingleAvailability };
