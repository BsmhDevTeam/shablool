import React from 'react';
import PropTypes from 'prop-types';
import GameNavbar from '/imports/ui/components/game-navbar';

export default class GameLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNoPlayerAlert: false,
    };
  }
  render() {
    const { game } = this.props;
    const players = game.getPlayersName();
    const startGame = () => {
      const showAlert = () => {
        this.setState({ showNoPlayerAlert: true });
        setTimeout(() => this.setState({ showNoPlayerAlert: false }), 3000);
      };
      game.applyMethod('startGame', [], (err, result) => result ? null : showAlert());
    };
    return (
      <div className="game-lobby">
        <div className="game-background" />
        <GameNavbar text={`הצטרף למשחק עם הקוד: ${game.code}`} num="" />
        <div className="main-content">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div className="player-count-area center-txt">
                <i className="count-num">
                  {players.length}
                </i>
                <br />
                <i className="count-txt">שחקנים</i>
              </div>
            </div>
            <div className="col-xl-6 col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div className="logo-area center-txt">
                <img className="logo" src="/img/Logo.svg" alt="logo" />
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div className="next-button-area center-txt">
                <button className="btn" onClick={startGame}>
                  התחל
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            {players
              ? <div className="lobby-players-names-area">
                <ul>
                  {players.map(player => <PlayersLobby key={player} name={player} />)}
                </ul>
              </div>
              : <div className="alert alert-is-primary">מחכה לשחקנים...</div>}
          </div>
        </div>
        <audio src="/game_lobby_audio.mp3" autoPlay loop />
        <div id="snackbar" className={this.state.showNoPlayerAlert ? 'show' : ''}>
          לא ניתן להתחיל משחק בלי שחקנים
        </div>
        <audio src="/lobby.mp3" autoPlay loop />
      </div>
    );
  }
}

GameLobby.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

const PlayersLobby = ({ name }) =>
  <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-4">
    <li>
      <span className="player-name">
        {name}
      </span>
    </li>
  </div>;

PlayersLobby.propTypes = {
  name: PropTypes.string.isRequired,
};
