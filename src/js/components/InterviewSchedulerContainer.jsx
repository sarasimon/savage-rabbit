import React from 'react';
import request from 'superagent';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import '../../scss/style.scss';
import FiltersComponent from './FiltersComponent';

const isAvailableSlot = (slotStart, nextEventStart, filterState) => {
  const availableSlotDuration = nextEventStart - slotStart;
  const interviewDuration = moment.duration(filterState.interviewDuration, 'seconds');
  const miliSecondsMargin = 1000;
  return (moment(slotStart).isBefore(nextEventStart) &&
   (availableSlotDuration + miliSecondsMargin >= interviewDuration));
};


const processRequest = (err, res, filterState) => {
  const events = res.body.items;
  let availableSlotStart = new Date(filterState.workingDayStart);

  console.log(events);

  if (res.status === 200) {
    for (let i = 0; i < events.length; i += 1) {
      const eventTime = new Date(events[i].start.dateTime);

      if (isAvailableSlot(availableSlotStart, eventTime, filterState)) {
        console.log(`${moment(availableSlotStart).toDate()} - ${eventTime}`);
      }
      availableSlotStart = new Date(events[i].end.dateTime);

      const available =
      isAvailableSlot(availableSlotStart, filterState.workingDayEnd, filterState);
      if (i === (events.length - 1) && available) {
        console.log(`${availableSlotStart} - ${moment(filterState.workingDayEnd).toDate()}`);
      }
    }
  }
};

export default class InterviewSchedulerContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handlerSearch = this.handlerSearch.bind(this);
  }

  handlerSearch(filterState) {
    console.log('Where are searching!', filterState);
    let calendarId;
    const token = this.props.token;
    for (let i = 0; i < filterState.people.length; i += 1) {
      calendarId = filterState.people[i];
      console.log(calendarId);
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

      const workingDayStart = filterState.workingDayStart.toISOString();
      const workingDayEnd = filterState.workingDayEnd.toISOString();

      request
        .get(url)
        .set('Authorization', `Bearer ${token}`)
        .query({ singleEvents: 'true' })
        .query({ orderBy: 'startTime' })
        .query({ timeMin: workingDayStart })
        .query({ timeMax: workingDayEnd })
        .end((err, res) => processRequest(err, res, filterState));
    }
  }

  render() {
    return (
      <div>
        <FiltersComponent onSearch={this.handlerSearch} />
      </div>
    );
  }
}

InterviewSchedulerContainer.propTypes = {
  token: PropTypes.string.isRequired,
};
