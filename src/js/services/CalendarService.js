/* eslint no-underscore-dangle: "off" */

import request from 'superagent';
import moment from 'moment';
import _ from 'lodash';
import { convertEventDateToDatetime } from '../utils';

require('twix');

const positiveResponse = (attendees, email) => {
  let hasPositiveResponse = true;
  attendees.forEach((attendee) => {
    if (attendee.email === email) {
      hasPositiveResponse = attendee.responseStatus !== 'accepted' || attendee.responseStatus === 'needsAction';
    }
  },
  );
  return hasPositiveResponse;
};

const processAvailabilityRequest = (events, email, start, end, duration) => {
  const confirmedEvents =
   events.filter(event =>
     (!event.attendees && (event.responseStatus === 'confirmed' || event.responseStatus === 'needsAction')) ||
    (event.attendees && positiveResponse(event.attendees, email)));

  const eventsTime = confirmedEvents.map(event => convertEventDateToDatetime(event));
  const minuteDuration = duration.minute() + (duration.hour() * 60);
  let queryRange = [moment(start).twix(end)];

  eventsTime.forEach((event) => {
    const eventRange = moment(event.start).twix(event.end);
    queryRange = _.flatMap(queryRange, range => range.difference(eventRange));
  });

  return queryRange.filter(range => range.asDuration('minutes')._milliseconds / 60000 >= minuteDuration)
    .map(range => ({
      start: range._start.toDate(),
      end: range._end.toDate(),
    }));
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
            data: processRequestFunct(
              res.body.items,
              res.body.summary,
              start,
              end,
              interviewDuration),
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
