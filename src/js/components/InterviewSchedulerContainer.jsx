import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarService from '../services/CalendarService';
import { requestEmails, requestSkills } from '../services/SpreadsheetService';
import '../../scss/style.scss';
import FiltersComponent from './FiltersComponent';
import ResultsComponent from './ResultsComponent';
import config from '../config';


export default class InterviewSchedulerContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handlerSearch = this.handlerSearch.bind(this);
    this.state = {
      slots: [],
      skills: [],
    };

    requestSkills(this.props.token, config.sheetId).then((skills) => {
      this.setState({
        skills
      })
    })
  }

  handlerSearch(filterState) {
    const token = this.props.token;
    const workingDayStart = filterState.workingDayStart;
    const workingDayEnd = filterState.workingDayEnd;
    const interviewDuration = filterState.interviewDuration;
    requestEmails(token, config.sheetId)
      .then(listOfEmails =>
        CalendarService.requestAvailability(token,
          workingDayStart,
          workingDayEnd,
          interviewDuration,
          listOfEmails))
      .then((freeSlots) => {
        this.setState({
          slots: freeSlots,
        });
      });
  }

  render() {
    return (
      <div>
        <FiltersComponent skills={this.state.skills} onSearch={this.handlerSearch} />
        <ResultsComponent data={this.state.slots} />
      </div>
    );
  }
}

InterviewSchedulerContainer.propTypes = {
  token: PropTypes.string.isRequired,
};
