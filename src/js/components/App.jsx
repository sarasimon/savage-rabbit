import React from 'react';
import Login from './Login';
import InterviewSchedulerContainer from './InterviewSchedulerContainer';
import '../../scss/style.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: undefined,
    };

    this.handlerToken = this.handlerToken.bind(this);
  }

  handlerToken(token) {
    this.setState({
      token,
    });
  }

  render() {
    return (
      <div className="app">
        <div>
          <h1 className="title">Savage Rabbit</h1>
          <img className="logo" src="https://media.giphy.com/media/WiXMlla4ZFR8Q/giphy.gif" alt="not important" />
        </div>
        { this.state.token ?
          <InterviewSchedulerContainer token={this.state.token} /> :
          <Login onSuccess={this.handlerToken} /> }
      </div>);
  }
}
