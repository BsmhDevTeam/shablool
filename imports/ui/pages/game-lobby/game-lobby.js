import React from 'react';
import PlayersLobby from '../../components/players-lobby/players-lobby';
import GameNavbar from '../../components/game-navbar/game-navbar';

const GameLobby = ({players, startGame}) => (
  <div className="game-lobby">
    <GameNavbar />
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
            <span>צהו"ל!</span>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div className="next-button-area center-txt">
            <a href="javascript:void(0)" className="btn" onClick={startGame}>התחל</a>
          </div>
        </div>
      </div>
      <div className="row">
        {players
          ? <div className="lobby-players-names-area">
            <ul>
              {players.map(player => (
                <PlayersLobby name={player} />
                ))}
            </ul>
          </div>
          : <div className="alert alert-is-primary">מחכה לשחקנים...</div>}
      </div>
    </div>
  </div>
);

export default GameLobby;
