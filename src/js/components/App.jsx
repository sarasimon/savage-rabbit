
import React from 'react';
import request from 'superagent';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../../scss/style.scss';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    const s = moment().set({ hour: 9, minute: 0, second: 0 });
    const e = moment().set({ hour: 18, minute: 0, second: 0 });
    const d = moment().set({ hour: 1, minute: 0, second: 0 });

    this.state = { signedIn: false,
      startDay: s,
      endDay: e,
      startDate: moment(),
      people: ['evulpe@thoughtworks.com', 'ssimon@thoughtworks.com'],
      slotDuration: d };


    funtion sum(a, b) {
      this.acumulate = a + b + this.acumulate;
    }.bind(this);


    this.handleSignOut = this.onSignOutClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleShowAvailability = this.showAvailability.bind(this);
    this.handleSingIn = this.onSignInClick.bind(this);
  }

  onSignInClick() {
    chrome.identity.getAuthToken({ interactive: true }, this.onSignInCallback.bind(this));
  }

  onSignOutClick() {
    // not working
    // chrome.identity.launchWebAuthFlow({ url: 'https://accounts.google.com/logout' }, this.onSignOutCallback.bind(this));
    this.onSignOutCallback();
  }

  onSignInCallback(token) {
    if (chrome.runtime.lastError) {
      alert(chrome.runtime.lastError.message);
      return;
    }
    this.setState({ signedIn: true, token });
  }

  onSignOutCallback() {
    this.setState({ signedIn: false });
  }

  showAvailability() {
    let calendarId;
    const token = this.state.token;
    for (let i = 0; i < this.state.people.length; i += 1) {
      calendarId = this.state.people[i];
      console.log(calendarId);
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

      const startTime = this.state.startDay.toISOString();
      const endTime = this.state.endDay.toISOString();

      request
        .get(url)
        .set('Authorization', `Bearer ${token}`)
        .query({ singleEvents: 'true' })
        .query({ orderBy: 'startTime' })
        .query({ timeMin: startTime })
        .query({ timeMax: endTime })
        .end(this.processRequest.bind(this));
    }
  }


  processRequest(err, res) {
    const events = res.body.items;
    let availableSlotStart = new Date(this.state.startDay);

    console.log(events);

    if (res.status === 200) {
      for (let i = 0; i < events.length; i += 1) {
        const eventTime = new Date(events[i].start.dateTime);

        if (this.isAvailableSlot(availableSlotStart, eventTime)) {
          console.log(`${moment(availableSlotStart).toDate()} - ${eventTime}`);
        }
        availableSlotStart = new Date(events[i].end.dateTime);

        const available = this.isAvailableSlot(availableSlotStart, this.state.endDay);
        if (i === (events.length - 1) && available) {
          console.log(`${availableSlotStart} - ${moment(this.state.endDay).toDate()}`);
        }
      }
    }
  }

  isAvailableSlot(slotStart, nextEventStart) {
    const availableSlotDuration = nextEventStart - slotStart;
    const interviewDuration = moment.duration(this.state.duration, 'seconds');
    const miliSecondsMargin = 1000;

    return (moment(slotStart).isBefore(nextEventStart) &&
     (availableSlotDuration + miliSecondsMargin >= interviewDuration));
  }

  handleChange(date) {
    this.setState({
      startDate: date,
    });

    this.state.startDay.set({ date: date.get('date'), month: date.get('month'), year: date.get('year') });
    this.state.endDay.set({ date: date.get('date'), month: date.get('month'), year: date.get('year') });
  }

  handleTimeChange(time) {
    const hour = Math.floor(time / 3600);
    const minutes = (time - (hour * 3600)) / 60;
    this.setState({ time });
    this.state.startDay.set({ hour, minute: minutes, second: 0 });
  }


  handleDurationChange(duration) {
    // var converter = new Converter(duration);
    const hour = Math.floor(duration / 3600);
    const minutes = (duration - (hour * 3600)) / 60;

    this.setState({ duration });
    this.state.slotDuration.set({ hour, minute: minutes, second: 0 });
  }

  render() {
    if (this.state.signedIn) {
      return (
        <div>
          <button onClick={this.handleSignOut} >Sign out</button>
          <br />
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="time-picker">Start</label>
          <TimePicker
            id="time-picker"
            format={24}
            start="09:00"
            end="18:00"
            step={30}
            onChange={this.handleTimeChange}
            value={this.state.time}
          />
          <label htmlFor="duration-picker">Duration</label>
          <TimePicker
            id="duration-picker"
            format={24}
            start="00:15"
            end="02:00"
            step={15}
            onChange={this.handleDurationChange}
            value={this.state.duration}
          />
          <br />
          <button onClick={this.handleShowAvailability} >Show</button>

        </div>
      );
    }
    return (
      <button onClick={this.handleSingIn} >Sign in with Google</button>
    );
  }

  // <DatePicker selected={this.state.start} onChange={this.handleChange}/>
}
