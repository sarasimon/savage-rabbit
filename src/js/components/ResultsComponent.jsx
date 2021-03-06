import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Timeline from 'react-calendar-timeline';
import _ from 'lodash';
import '../../scss/style.scss';

const preprocessData = (data) => {
  const groups = data.map((value, i) => ({
    id: i,
    title: `${value.level} - ${value.name}`,
  }));

  const items = [];
  let incrementItemId = 0;

  for (let i = 0; i < data.length; i += 1) {
    const group = i;
    const events = data[i].data;
    const weekInterviews = data[i].weekInterviews;

    for (let j = 0; j < events.length; j += 1) {
      const cname = weekInterviews === 1 ? 'one' : 'two';
      const event = events[j];
      const item = {
        id: incrementItemId,
        group,
        start_time: moment(event.start),
        end_time: moment(event.end),
        className: weekInterviews === 0 ? 'none' : cname,
      };

      items.push(item);
      incrementItemId += 1;
    }
  }

  return {
    items,
    groups,
  };
};

const ResultsComponent = (props) => {
  const { items, groups } = preprocessData(props.data);
  if (items.length === 0) {
    return (<div> No results ... </div>);
  }

  const startTime = _.minBy(items, item => item.start_time).start_time;
  const endTime = _.maxBy(items, item => item.end_time).end_time;

  return (
    <Timeline
      groups={groups}
      items={items}
      visibleTimeStart={startTime.unix() * 1000}
      visibleTimeEnd={endTime.unix() * 1000}
      canMove={false}
      maxZoom={86400 * 1000}
    />
  );
};


ResultsComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  })).isRequired,
};


export default ResultsComponent;
