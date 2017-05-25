import React from 'react';

const PlayersLobby = (props) => (
    <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-4">
        <li>
            <span className="player-name">{ props.name }</span>
        </li>   
    </div>
);

export default PlayersLobby;
