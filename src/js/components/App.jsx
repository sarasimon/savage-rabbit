import React from 'react';
import Login from './Login';
import InterviewSchedulerContainer from './InterviewSchedulerContainer';
import '../../scss/style.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };

    this.handlerToken = this.handlerToken.bind(this);
  }

  handlerToken(token) {
    this.setState({
      token,
    });
  }

  render() {
    if (this.state.token) {
      return (
        <InterviewSchedulerContainer
          token={this.state.token}
        />);
    }
    return (<Login onSuccess={this.handlerToken} />);
  }
}
