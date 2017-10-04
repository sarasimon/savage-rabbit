import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import requestAvailability from '../services/CalendarService';
import requestEmails from '../services/SpreadsheetService';
import '../../scss/style.scss';
import FiltersComponent from './FiltersComponent';


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

    requestEmails(token, '1Jp4nE1XQWBns_U11LKXN5FvBwBrWfVmJfLKOAKaxVTM', 'A1:A9')
      .then(listOfEmails =>
        requestAvailability(token, workingDayStart, workingDayEnd, interviewDuration, listOfEmails))
      .then((freeSlots) => {
        console.log('Free slots', freeSlots);
      });
  }

  render() {
    var columns = undefined;
    var rows = undefined;

    return (
      <div>
      <FiltersComponent onSearch={this.handlerSearch} />
      <table className={this.props.className}>
       <thead>
        <tr>
         ["1", "2", "3"]
        </tr>
       </thead>
       <tbody>
        ["a", "b", "c"]
       </tbody>
      </table>
      </div>
      );
  }
}

InterviewSchedulerContainer.propTypes = {
  token: PropTypes.string.isRequired,
};
