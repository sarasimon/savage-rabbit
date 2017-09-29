import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import '../../scss/style.scss';

const convertToTime = (seconds) => {
  const hour = Math.floor(seconds / 3600);
  const minute = (seconds - (hour * 3600)) / 60;

  return {
    hour,
    minute,
    second: 0,
  };
};

export default class FiltersComponent extends React.Component {
  constructor(props) {
    super(props);

    const workingDayStart = moment().set({ hour: 9, minute: 0, second: 0 });
    const workingDayEnd = moment().set({ hour: 18, minute: 0, second: 0 });
    const interviewDuration = moment().set({ hour: 1, minute: 0, second: 0 });

    this.state = {
      workingDayStart,
      workingDayEnd,
      interviewDuration,
      interviewDate: moment(),
      people: ['evulpe@thoughtworks.com', 'ssimon@thoughtworks.com'],
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleDateChange(date) {
    this.setState({
      interviewDate: date,
    });

    this.state.workingDayStart.set({ date: date.get('date'), month: date.get('month'), year: date.get('year') });
    this.state.workingDayEnd.set({ date: date.get('date'), month: date.get('month'), year: date.get('year') });
  }

  handleTimeChange(time) {
    this.setState({ time });
    this.state.workingDayStart.set(convertToTime(time));
  }


  handleDurationChange(duration) {
    this.setState({ duration });
    this.state.interviewDuration.set(convertToTime(duration));
  }

  handleOnClick() {
    this.props.onSearch(this.state);
  }

  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.interviewDate}
          onChange={this.handleDateChange}
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
        <button onClick={this.handleOnClick} >Show</button>
      </div>
    );
  }
}

FiltersComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
