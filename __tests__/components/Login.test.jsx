import React from 'react';
import { shallow } from 'enzyme';
import Login from '../../src/js/components/Login';

describe('Login', () => {
  test('test login on success', () => {
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
    const onSuccess = (token) => {
      expect(token).toBe('TOKEN_ID');
    };

    const wrapper = shallow(<Login onSuccess={onSuccess} />);
    expect(wrapper.state().token).toBe(undefined);
    wrapper.find('Button').simulate('click');
    expect(wrapper.state().token).toBe('TOKEN_ID');
  });

  test('test login on error', () => {
    global.chrome = {
      runtime: {
        lastError: {
          message: 'error',
        },
      },

      identity: {
        getAuthToken: (configuration, callback) => {
          callback('TOKEN_ID');
        },
      },
    };
    const onSuccess = (token) => {
      expect(token).toBe('TOKEN_ID');
    };

    const wrapper = shallow(<Login onSuccess={onSuccess} />);
    expect(wrapper.state().token).toBe(undefined);
    wrapper.find('Button').simulate('click');
    expect(wrapper.state().token).toBe(undefined);
  });
});
