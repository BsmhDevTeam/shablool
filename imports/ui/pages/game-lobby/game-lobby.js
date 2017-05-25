import React from 'react';
import PlayersLobby from '../../components/players-lobby/players-lobby';
import GameNavbar from '../../components/game-navbar/game-navbar';

const players = [
  {
    id: '64143',
    name: 'קליגר',
  },
  {
    id: '64143',
    name: 'לידור',
  },
  {
    id: '64143',
    name: 'גל',
  },
  {
    id: '64143',
    name: 'זיו',
  },
  {
    id: '64143',
    name: 'יניב',
  },
  {
    id: '64143',
    name: 'גל',
  },
  {
    id: '64143',
    name: 'שיר',
  },
  {
    id: '64143',
    name: 'יניב',
  },
  {
    id: '64143',
    name: 'אלעד',
  },
  {
    id: '64143',
    name: 'נסטיה',
  },
  {
    id: '64143',
    name: 'יניב',
  },
  {
    id: '64143',
    name: 'גפן',
  },
  {
    id: '64143',
    name: 'זיו',
  },
  {
    id: '64143',
    name: 'אלין',
  },
  {
    id: '64143',
    name: 'גל',
  },
  {
    id: '64143',
    name: 'יניב',
  },
  {
    id: '64143',
    name: 'זיו',
  },
  {
    id: '64143',
    name: 'ספיר',
  },
  {
    id: '64143',
    name: 'בני',
  },
  {
    id: '64143',
    name: 'מורן',
  },
];

const GameLobby = () => (
  <div className="game-lobby">
    <GameNavbar />
    <div className="main-content">
      <div className="row">
        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div className="player-count-area center-txt">
            <i className="count-num">{players.count}</i>
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
            <a className="btn">התחל</a>
          </div>
        </div>
      </div>
      <div className="row">
        {players
          ? <div className="lobby-players-names-area">
            <ul>
              {players.map(player => (
                <PlayersLobby name={player.name} />
                ))}
            </ul>
          </div>
          : <div className="alert alert-is-primary">מחכה לשחקנים...</div>}
      </div>
    </div>
  </div>
);

export default GameLobby;
