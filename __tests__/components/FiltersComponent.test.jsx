import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import FiltersComponent from '../../src/js/components/FiltersComponent';

describe('FiltersComponent', () => {
  const defaultDayStart = moment().set({ hour: 9, minute: 0, second: 0 });
  const defaultDayEnd = moment().set({ hour: 18, minute: 0, second: 0 });
  const defaultInterviewDuration = moment().set({ hour: 0, minute: 15, second: 0 });
  const defaultInterviewDate = moment();

  test('test FiltersComponent initial state', () => {
    const wrapper = shallow(<FiltersComponent onSearch={() => {}} />);
    expect(wrapper.state().workingDayStart.date()).toBe(defaultDayStart.date());
    expect(wrapper.state().workingDayStart.month()).toBe(defaultDayStart.month());
    expect(wrapper.state().workingDayStart.year()).toBe(defaultDayStart.year());
    expect(wrapper.state().workingDayStart.hour()).toBe(defaultDayStart.hour());
    expect(wrapper.state().workingDayStart.minute()).toBe(defaultDayStart.minute());
    expect(wrapper.state().workingDayStart.second()).toBe(defaultDayStart.second());

    expect(wrapper.state().workingDayEnd.date()).toBe(defaultDayEnd.date());
    expect(wrapper.state().workingDayEnd.month()).toBe(defaultDayEnd.month());
    expect(wrapper.state().workingDayEnd.year()).toBe(defaultDayEnd.year());
    expect(wrapper.state().workingDayEnd.hour()).toBe(defaultDayEnd.hour());
    expect(wrapper.state().workingDayEnd.minute()).toBe(defaultDayEnd.minute());
    expect(wrapper.state().workingDayEnd.second()).toBe(defaultDayEnd.second());

    expect(wrapper.state().interviewDuration.hour()).toBe(defaultInterviewDuration.hour());
    expect(wrapper.state().interviewDuration.minute()).toBe(defaultInterviewDuration.minute());
    expect(wrapper.state().interviewDuration.second()).toBe(defaultInterviewDuration.second());

    expect(wrapper.state().interviewDate.date()).toBe(defaultInterviewDate.date());
    expect(wrapper.state().interviewDate.month()).toBe(defaultInterviewDate.month());
    expect(wrapper.state().interviewDate.year()).toBe(defaultInterviewDate.year());
  });

  test('test FiltersComponent handle date change', () => {
    const spy = jest.spyOn(FiltersComponent.prototype, 'handleDateChange');
    const wrapper = shallow(<FiltersComponent onSearch={() => {}} />);

    const newDate = moment().set({ date: 19, month: 12, year: 2017 });
    wrapper.instance().handleDateChange(newDate);
    wrapper.update();
    expect(spy).toHaveBeenCalled();

    expect(wrapper.state().workingDayStart.date()).toBe(newDate.date());
    expect(wrapper.state().workingDayStart.month()).toBe(newDate.month());
    expect(wrapper.state().workingDayStart.year()).toBe(newDate.year());
    expect(wrapper.state().workingDayStart.hour()).toBe(defaultDayStart.hour());
    expect(wrapper.state().workingDayStart.minute()).toBe(defaultDayStart.minute());
    expect(wrapper.state().workingDayStart.second()).toBe(defaultDayStart.second());

    expect(wrapper.state().workingDayEnd.date()).toBe(newDate.date());
    expect(wrapper.state().workingDayEnd.month()).toBe(newDate.month());
    expect(wrapper.state().workingDayEnd.year()).toBe(newDate.year());
    expect(wrapper.state().workingDayEnd.hour()).toBe(defaultDayEnd.hour());
    expect(wrapper.state().workingDayEnd.minute()).toBe(defaultDayEnd.minute());
    expect(wrapper.state().workingDayEnd.second()).toBe(defaultDayEnd.second());

    expect(wrapper.state().interviewDuration.hour()).toBe(defaultInterviewDuration.hour());
    expect(wrapper.state().interviewDuration.minute()).toBe(defaultInterviewDuration.minute());
    expect(wrapper.state().interviewDuration.second()).toBe(defaultInterviewDuration.second());

    expect(wrapper.state().interviewDate.date()).toBe(newDate.date());
    expect(wrapper.state().interviewDate.month()).toBe(newDate.month());
    expect(wrapper.state().interviewDate.year()).toBe(newDate.year());
  });
});
