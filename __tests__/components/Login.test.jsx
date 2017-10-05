window.chrome = {
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
import renderer from 'react-test-renderer';
import Login from '../../src/js/components/Login';


describe('Login', () => {
  test('test basic login', (done) => {
    const onSuccess = (token) => {
      expect(token).toBe('TOKEN_ID');
      done();
    };

    const component = renderer.create(
      <Login onSuccess={onSuccess} />,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    tree.props.onClick();
  });
});
