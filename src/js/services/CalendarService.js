import request from 'superagent';
import moment from 'moment';
import { convertEventDateToDatetime } from '../utils';
import _ from 'lodash';

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
 
const processAvailabilityRequest = (events, start, end, duration) => {
  let slotStart = new Date(start);
  const endOfDay = new Date(end);
  const slots = [];

  events = events.map(event => convertEventDateToDatetime(event))
  events = _.sortBy(events, (event) => event.end);

  if (events.length === 0) {
    addSlot(slots, slotStart, endOfDay);
  }

  events.forEach((event, i) => {
    if (isAvailableSlot(slotStart, event.start, duration)) {
      addSlot(slots, slotStart, event.start);
    }

    slotStart = event.end;

    if (i === (events.length - 1) && isAvailableSlot(slotStart, endOfDay, duration)) {
      addSlot(slots, slotStart, endOfDay);
    }
  });
  return slots;
};

const countEventsPerPerson = (events) => {
  const listOfAttendees = {};

  events.filter(event => event.summary && !event.summary.match(/Wash Up/g) && event.attendees)
    .forEach((event) => {
      event.attendees.forEach((attendee) => {
        const email = attendee.email;
        if (attendee.responseStatus === 'accepted' && !attendee.resource) {
          if (!listOfAttendees[email]) {
            listOfAttendees[email] = 1;
          } else {
            listOfAttendees[email] += 1;
          }
        }
      });
    });

  return listOfAttendees;
};

const requestInterviewsPerPerson = (token, interviewDate) => {
  const interviewCalendarId = 'thoughtworks.com_kogd6p4cuhc1uh6ul5v5shba7k@group.calendar.google.com';
  const url = `https://www.googleapis.com/calendar/v3/calendars/${interviewCalendarId}/events`;

  const weekStart = moment(interviewDate).startOf('isoweek').toISOString();
  const weekEnd = moment(interviewDate).endOf('week').toISOString();

  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .query({ singleEvents: 'true' })
      .query({ orderBy: 'startTime' })
      .query({ timeMin: weekStart })
      .query({ timeMax: weekEnd })
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(countEventsPerPerson(res.body.items));
        }
      });
  });
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
  const promises = listOfEmails.map(email => requestSingleAvailability(
    token, workingDayStart, workingDayEnd, interviewDuration, email, processAvailabilityRequest));
  return Promise.all(promises);
});

export default { requestAvailability, requestInterviewsPerPerson };
