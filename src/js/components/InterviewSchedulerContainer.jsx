import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import requestAvailability from './CalendarService';
import '../../scss/style.scss';
import FiltersComponent from './FiltersComponent';
import config from '../config';


export default class InterviewSchedulerContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handlerSearch = this.handlerSearch.bind(this);
  }

  handlerSearch(filterState) {
    const token = this.props.token;
    const workingDayStart = filterState.workingDayStart;
    const workingDayEnd = filterState.workingDayEnd;
    const interviewDuration = filterState.interviewDuration;
    const listOfEmails = config.people;

    requestAvailability(token, workingDayStart, workingDayEnd, interviewDuration, listOfEmails,
      (results, error) => {
        console.log(results, error);
      });
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
