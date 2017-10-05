import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import moment from 'moment';
import FiltersComponent from '../../src/js/components/FiltersComponent';

configure({ adapter: new Adapter() });


describe('FiltersComponent', () => {
    
  test('test FiltersComponent initial state', () => {
    const defaultDayStart = moment().set({ hour: 9, minute: 0, second: 0 });
    const defaultDayEnd = moment().set({ hour: 18, minute: 0, second: 0 });
    const defaultInterviewDuration = moment().set({ hour: 0, minute: 15, second: 0 });
    const defaultInterviewDate = moment();
    const config = {
      workingDayStart: defaultDayStart,
      workingDayEnd: defaultDayEnd,
      interviewDuration: defaultInterviewDuration,
      interviewDate: defaultInterviewDate,
    };
      

    const wrapper = shallow(<FiltersComponent />);
    expect(wrapper.state().workingDayStart.date()).toBe(defaultDayStart.date());
    expect(wrapper.state().workingDayStart.hour()).toBe(defaultDayStart.hour());
    expect(wrapper.state().workingDayStart.minute()).toBe(defaultDayStart.minute());
    expect(wrapper.state().workingDayStart.second()).toBe(defaultDayStart.second());
        
    expect(wrapper.state().workingDayEnd.date()).toBe(defaultDayEnd.date());
    expect(wrapper.state().workingDayEnd.hour()).toBe(defaultDayEnd.hour());
    expect(wrapper.state().workingDayEnd.minute()).toBe(defaultDayEnd.minute());
    expect(wrapper.state().workingDayEnd.second()).toBe(defaultDayEnd.second());
      
    expect(wrapper.state().interviewDuration.hour()).toBe(defaultInterviewDuration.hour());
    expect(wrapper.state().interviewDuration.minute()).toBe(defaultInterviewDuration.minute());
    expect(wrapper.state().interviewDuration.second()).toBe(defaultInterviewDuration.second());
      
    expect(wrapper.state().interviewDate.date()).toBe(defaultInterviewDate.date());

  });
    
  test('test FiltersComponent handle date change', () => {
    const defaultDayStart = moment().set({ hour: 9, minute: 0, second: 0 });
    const defaultDayEnd = moment().set({ hour: 18, minute: 0, second: 0 });
    const defaultInterviewDuration = moment().set({ hour: 0, minute: 15, second: 0 });
    const defaultInterviewDate = moment();
    const config = {
      workingDayStart: defaultDayStart,
      workingDayEnd: defaultDayEnd,
      interviewDuration: defaultInterviewDuration,
      interviewDate: defaultInterviewDate,
    };
      
    const spy = jest.spyOn(FiltersComponent.prototype, 'handleDateChange');
    const wrapper = shallow(<FiltersComponent />);
      
    const newDate = moment().set({ date: 19, month: 12, year: 2017 });
    wrapper.instance().handleDateChange(newDate);
    wrapper.update();
    expect(spy).toHaveBeenCalled();
      
    expect(wrapper.state().workingDayStart.date()).toBe(newDate.date());
    expect(wrapper.state().workingDayStart.hour()).toBe(defaultDayStart.hour());
    expect(wrapper.state().workingDayStart.minute()).toBe(defaultDayStart.minute());
    expect(wrapper.state().workingDayStart.second()).toBe(defaultDayStart.second());
        
    expect(wrapper.state().workingDayEnd.date()).toBe(newDate.date());
    expect(wrapper.state().workingDayEnd.hour()).toBe(defaultDayEnd.hour());
    expect(wrapper.state().workingDayEnd.minute()).toBe(defaultDayEnd.minute());
    expect(wrapper.state().workingDayEnd.second()).toBe(defaultDayEnd.second());
      
    expect(wrapper.state().interviewDuration.hour()).toBe(defaultInterviewDuration.hour());
    expect(wrapper.state().interviewDuration.minute()).toBe(defaultInterviewDuration.minute());
    expect(wrapper.state().interviewDuration.second()).toBe(defaultInterviewDuration.second());
      
    expect(wrapper.state().interviewDate.date()).toBe(newDate.date());

  });
    
})