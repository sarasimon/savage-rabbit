import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import 'react-datepicker/dist/react-datepicker.css';
import config from '../config';
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

    this.state = {
      workingDayStart: config.defaultDayStart,
      workingDayEnd: config.defaultDayEnd,
      interviewDuration: config.defaultInterviewDuration,
      interviewDate: moment(),
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
      <div className="filters-component">
        <label htmlFor="date-picker">Interview Date</label>
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
        <Button bsStyle="primary" onClick={this.handleOnClick} >Show</Button>
      </div>
    );
  }
}

FiltersComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
