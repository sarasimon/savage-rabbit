import React from 'react';
import PropTypes from 'prop-types';

// <button onClick={this.handleSingIn} >Sign in with Google</button>
export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onSignInClick = this.onSignInClick.bind(this);
  }

  onSignInClick() {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
      } else {
        this.setState({ token });
        this.props.onSuccess(token);
      }
    });
  }

  render() {
    return (<button onClick={this.onSignInClick} >Sign in with Google</button>);
  }
}

Login.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
