import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Game from '/imports/api/games/games';
import Loading from '../../components/loading.js';

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

      const maybeGame = Game.find({ code: gameCode }).fetch();
      console.log('maybeGame:');
      console.log(maybeGame);
      const maybeGameUserManage = maybeGame.filter(
        g => g.quiz.owner === Meteor.userId(),
      );
      const maybeRedirectToGameAsManager = maybeGameUserManage.map((g) => {
        FlowRouter.go('Game.Main', { code: g.code });
        return g;
      });
      if (maybeRedirectToGameAsManager.length !== 0) return;

      const maybeGameUserNotIn = maybeGame.filter(g => !g.isUserRegistered());
      const maybeGameUserIn = [
        ...maybeGameUserNotIn.map((g) => {
          g.applyMethod('playerRegister', []);
          return g;
        }),
        ...maybeGame.filter(g => g.isUserRegistered()),
      ];
      const maybeRedirectToGameAsPlayer = maybeGameUserIn.map(g =>
        FlowRouter.go('Game.Main', { code: g.code }),
      );

      const notifyUser = () => {
        this.setState({ badGameCode: true });
        setTimeout(() => this.setState({ badGameCode: false }), 3000);
      };

      maybeRedirectToGameAsManager.length === 0 &&
        maybeRedirectToGameAsPlayer.length === 0 &&
        notifyUser();
    };

    return (
      <div id="home">
        <div className="game-background" />
        <div className="row">
          <div className="col-xl-2 col-xl-offset-5 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12" id="logo-area">
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
                  <button
                    className="btn btn-primary"
                    type="submit"
                    id="start-game-btn"
                  >
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

const HomeContainer = ({ loading }) => {
  if (loading) return <Loading color={'white'} />;
  return <Home />;
};

HomeContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default createContainer(() => {
  const gameHandle = Meteor.subscribe('games.open');
  const loading = !gameHandle.ready();
  return {
    loading,
  };
}, HomeContainer);
