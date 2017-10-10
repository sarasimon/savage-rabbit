import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import { requestSkills } from '../services/SpreadsheetService';
import requestFreeSlots from '../services/SavageRabbitService';
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
    this.setState({ status: 'loading' });
    requestFreeSlots(token, config.sheetId, skill, level,
      workingDayStart, workingDayEnd, interviewDuration)
      .then((listOfFreeSlots) => {
        this.setState({
          slots: listOfFreeSlots,
          status: 'success',
        });
      }).catch(() => {
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
