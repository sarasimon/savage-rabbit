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

const renderResults = (status, slots) => {
  if (status === 'error') {
    return (<span> Oopps something wrong happened! </span>);
  } else if (status === 'loading') {
    return (<span> Loading data... please wait! </span>);
  } else if (status === 'success') {
    return (<ResultsComponent data={slots} />);
  }
  return (<div />);
};

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
    this.setState({ status: 'loading' });
    requestEmails(token, config.sheetId, skill, level)
      .then(listOfPeople => CalendarService.requestInterviewsPerPerson(token, workingDayStart)
        .then((attendeesCount) => {

          listOfPeople.forEach((person) => {
            const interviewsCount = attendeesCount[person.email] || 0;
            person.weekInterviews = interviewsCount;
          });
          console.log(listOfPeople);
          // return listOfPeople.filter(person => person.weekInterviews < 2);

          return listOfPeople.filter(person => !attendeesCount[person.email] || attendeesCount[person.email] < 2)
        }))
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
          status: 'success',
        });
      })
      .catch(() => {
        this.setState({ status: 'error' });
      });
  }

  render() {
    const results = renderResults(this.state.status, this.state.slots);

    return (
      <div>
        <FiltersComponent skills={this.state.skills} onSearch={this.handlerSearch} />
        {results}
      </div>
    );
  }
}

InterviewSchedulerContainer.propTypes = {
  token: PropTypes.string.isRequired,
};
