jest.mock('chrome')
import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../../src/js/components/Login';


describe('Login', () => {
  test('test basic login', () => {
    const component = renderer.create(
      <Login onSuccess={() => {}} />,
    );
    /*  
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    tree.props.onClick();
      
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    */
  });
});
