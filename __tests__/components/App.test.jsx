import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import App from '../../src/js/components/App';
import Login from '../../src/js/components/Login';
import InterviewSchedulerContainer from '../../src/js/components/InterviewSchedulerContainer';

configure({ adapter: new Adapter() });


describe('App', () => {
  test('test App when not logged in', () => {

    const wrapper = shallow(<App />);
    expect(wrapper.find(Login).length).toBe(1);
    expect(wrapper.find(InterviewSchedulerContainer).length).toBe(0);
  });
    
  test('test App when logged in', () => {

    const wrapper = shallow(<App />);
    wrapper.setState({ token: 'token' });
    expect(wrapper.find(Login).length).toBe(0);
    expect(wrapper.find(InterviewSchedulerContainer).length).toBe(1);
  });
});
