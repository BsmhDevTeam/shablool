import React from 'react';

const PlayersLobby = ({ name }) => (
  <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-4">
    <li>
      <span className="player-name">{ name }</span>
    </li>
  </div>
);

export default PlayersLobby;
