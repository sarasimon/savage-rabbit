import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import ResultsComponent from '../../src/js/components/ResultsComponent';

const morningDate = new Date(1507194000000); // Thursday, 5 October 2017 09:00:00
const lunchDate = new Date(1507208400000); // Thursday, 5 October 2017 13:00:00
const nightDate = new Date(1507240800000); // Thursday, 5 October 2017 22:00:00


test('single event of a single person', () => {
  const data = [
    {
      email: 'jcoscol@thoughtworks.com',
      data: [
        {
          start: morningDate,
          end: lunchDate,
        },
      ],
    },
  ];

  const timetable = shallow(<ResultsComponent data={data} />);

  const expectedGroups = [{ id: 0, title: 'jcoscol@thoughtworks.com' }];
  const expectedItems = [{
    id: 0,
    group: 0,
    start_time: moment(morningDate),
    end_time: moment(lunchDate),
  }];

  expect(timetable.prop('groups')).toEqual(expectedGroups);
  expect(timetable.prop('items')).toEqual(expectedItems);
});

test('two events of a single person', () => {
  const data = [
    {
      email: 'jcoscol@thoughtworks.com',
      data: [
        {
          start: morningDate,
          end: lunchDate,
        },
        {
          start: lunchDate,
          end: nightDate,
        },
      ],
    },
  ];

  const timetable = shallow(<ResultsComponent data={data} />);

  const expectedGroups = [{ id: 0, title: 'jcoscol@thoughtworks.com' }];
  const expectedItems = [{
    id: 0,
    group: 0,
    start_time: moment(morningDate),
    end_time: moment(lunchDate),
  }, {
    id: 1,
    group: 0,
    start_time: moment(lunchDate),
    end_time: moment(nightDate),
  }];

  expect(timetable.prop('groups')).toEqual(expectedGroups);
  expect(timetable.prop('items')).toEqual(expectedItems);
});

test('single event for each person', () => {
  const data = [
    {
      email: 'jcoscol@thoughtworks.com',
      data: [
        {
          start: morningDate,
          end: lunchDate,
        },
      ],
    },
    {
      email: 'evulpe@thoughtworks.com',
      data: [
        {
          start: morningDate,
          end: lunchDate,
        },
      ],
    },
  ];

  const timetable = shallow(<ResultsComponent data={data} />);

  const expectedGroups = [
    { id: 0, title: 'jcoscol@thoughtworks.com' },
    { id: 1, title: 'evulpe@thoughtworks.com' },
  ];

  const expectedItems = [{
    id: 0,
    group: 0,
    start_time: moment(morningDate),
    end_time: moment(lunchDate),
  }, {
    id: 1,
    group: 1,
    start_time: moment(morningDate),
    end_time: moment(lunchDate),
  }];

  expect(timetable.prop('groups')).toEqual(expectedGroups);
  expect(timetable.prop('items')).toEqual(expectedItems);
});
