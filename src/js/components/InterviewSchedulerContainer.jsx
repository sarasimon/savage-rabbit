import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
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
        skills,
      });
    });
  }

  handlerSearch(filterState) {
    const token = this.props.token;
    const workingDayStart = filterState.workingDayStart;
    const workingDayEnd = filterState.workingDayEnd;
    const interviewDuration = filterState.interviewDuration;
    const skill = filterState.skill;
    const level = filterState.level;
    let people = [];

    requestEmails(token, config.sheetId, skill, level)
      .then((listOfPeople) => {
        people = listOfPeople;
        return CalendarService.requestAvailability(token,
          workingDayStart,
          workingDayEnd,
          interviewDuration,
          listOfPeople.map(item => item.email));
      })
      .then((freeSlots) => {
        let merged = _.map(people, item => _.assign(item, _.find(freeSlots, ['email', item.email])));
        merged = _.reverse(_.sortBy(merged, ['level']));
        this.setState({
          slots: merged,
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
