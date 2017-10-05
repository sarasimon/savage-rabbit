global.chrome = {
  runtime: {
    lastError: false,
  },

  identity: {
    getAuthToken: (configuration, callback) => {
      callback('TOKEN_ID');
    },
  },
};

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Login from '../../src/js/components/Login';

configure({ adapter: new Adapter() });


describe('Login', () => {
  test('test basic login', () => {
    const onSuccess = (token) => {
      expect(token).toBe('TOKEN_ID');
    };

    const wrapper = shallow(<Login onSuccess={onSuccess}/>);
    expect(wrapper.state().token).toBe(undefined);
    wrapper.find('Button').simulate('click');
    expect(wrapper.state().token).toBe('TOKEN_ID');
  });
});
