import React from 'react';
import GameNavbar from '../../components/game-navbar';

const GameLobby = ({ game }) => {
  const players = game.getGamePlayersName();
  const startGame = () => {
    game.applyMethod('startGame', []);
  };
  return (
    <div className="game-lobby">
      <div className="game-background" />
      <GameNavbar text={`הצטרף למשחק עם הקוד: ${game.code}`} num="" />
      <div className="main-content">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="player-count-area center-txt">
              <i className="count-num">{players.length}</i>
              <br />
              <i className="count-txt">שחקנים</i>
            </div>
          </div>
          <div className="col-xl-6 col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="logo-area center-txt">
              <img className="logo" src="/img/Logo.svg"/>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="next-button-area center-txt">
              <button className="btn" onClick={startGame}>התחל</button>
            </div>
          </div>
        </div>
        <div className="row">
          {players
            ? <div className="lobby-players-names-area">
              <ul>
                {players.map(player => (
                  <PlayersLobby key={player} name={player} />
                  ))}
              </ul>
            </div>
            : <div className="alert alert-is-primary">מחכה לשחקנים...</div>}
        </div>
      </div>
    </div>
  );
};

const PlayersLobby = ({ name }) => (
  <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-4">
    <li>
      <span className="player-name">{ name }</span>
    </li>
  </div>
);

export default GameLobby;
