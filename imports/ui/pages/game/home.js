import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { joinGameResults } from '/imports/startup/both/constants';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badGameCode: false,
    };
  }

  render() {
    const enterGame = (e) => {
      e.preventDefault();
      const form = e.target;
      const gameCode = form.gameCode.value;
      form.gameCode.value = '';

      const notifyUser = () => {
        this.setState({ badGameCode: true });
        setTimeout(() => this.setState({ badGameCode: false }), 3000);
      };

      Meteor.call(
        'joinGame',
        {
          code: gameCode,
        },
        (err, res) => (res === joinGameResults.noGame) ? notifyUser() : FlowRouter.go('Game.Play', { code: gameCode }),
      );
    };

    return (
      <div id="home">
        <div className="game-background" />
        <div className="row">
          <div
            className="col-xl-2 col-xl-offset-5 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12"
            id="logo-area"
          >
            <img className="logo" src="/img/Logo.svg" alt="logo" />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-2 col-xl-offset-5 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
            <div>
              <form onSubmit={enterGame}>
                <div className="row">
                  <input
                    type="text"
                    name="gameCode"
                    id="main-input"
                    className="input"
                    placeholder="הכנס קוד שאלון"
                  />
                </div>
                <div className="row">
                  <button className="btn btn-primary" type="submit" id="start-game-btn">
                    התחל משחק!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <p id="center-home-massage">
          <a href="/Manage">נהל או צור משחק חדש</a>
        </p>
        <div id="snackbar" className={this.state.badGameCode ? 'show' : ''}>
          לא נמצא משחק
        </div>
      </div>
    );
  }
}

export default Home;
