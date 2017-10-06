import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import 'react-datepicker/dist/react-datepicker';
import config from '../config';
import '../../scss/style.scss';
import convertToTime from '../utils';

export default class FiltersComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workingDayStart: config.defaultDayStart,
      workingDayEnd: config.defaultDayEnd,
      interviewDuration: config.defaultInterviewDuration,
      interviewDate: moment(),
      skill: props.skills[0],
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleSkillChange = this.handleSkillChange.bind(this);
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

  handleSkillChange(event) {
    this.setState({ skill: event.target.value });
  }

  render() {
    const skillOptions = this.props.skills.map(
      skill => (<option value={skill} key={skill}>{skill}</option>));

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
        <label htmlFor="skills-picker">Skills</label>
        <FormControl
          id="skills-picker"
          componentClass="select"
          placeholder="select"
          onChange={this.handleSkillChange}
        >
          {skillOptions}
        </FormControl>
        <br />
        <Button bsStyle="primary" onClick={this.handleOnClick} >Show</Button>
      </div>
    );
  }
}

FiltersComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
};
