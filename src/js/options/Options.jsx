import React from 'react';
import '../../scss/style.scss';

export default class Options extends React.Component {
  constructor(props) {
    super(props);

    chrome.storage.sync.get({
      token: '',
      location: '',
    }, (items) => {
      this.state = {
        token: items.token,
        location: items.location,
      };
    });
  }

  render() {
    const { token, location } = this.state;

    return (
      <div className="app">
        <div>
          <h1 className="title">Options</h1>
          <img className="logo" src="https://media.giphy.com/media/WiXMlla4ZFR8Q/giphy.gif" alt="not important" />
        </div>
        <div>
          <p>
            <label htmlFor="office-location">Office location</label>
            <input id="office-location" type="text" value={location} />
          </p>
          <p>
            <label htmlFor="token">Jigsaw token</label>
            <input id="token" type="text" value={token} />
          </p>
        </div>
      </div>);
  }
}
