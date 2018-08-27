import React from 'react';
import PropTypes from 'prop-types';
import { managementTabs } from '/imports/startup/both/constants.js';
import GameCardManaged from '/imports/ui/components/game-card-managed.js';

const GamesManaged = ({ activeTab, gamesManagedAndGameLogs }) =>
  <div className={`tab-pane fade in ${activeTab === managementTabs.gamesManaged ? 'active' : ''}`}>
    {gamesManagedAndGameLogs.length
      ? gamesManagedAndGameLogs.map(game =>
        <div className="row" key={game.game._id}>
          <GameCardManaged game={game.game} gameLog={game.gameLog} />
        </div>,
        )
      : <h3>עדיין לא ארגנת משחק לחברים?</h3>}
  </div>;

GamesManaged.propTypes = {
  activeTab: PropTypes.string.isRequired,
  gamesManagedAndGameLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GamesManaged;
