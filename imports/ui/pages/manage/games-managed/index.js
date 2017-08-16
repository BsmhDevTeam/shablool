import React from 'react';
import PropTypes from 'prop-types';
import { managementTabs } from '/imports/startup/both/constants.js';
import GameCardManaged from '/imports/ui/components/game-card-managed.js';

const GamesManaged = ({ activeTab, gamesManaged }) =>
  <div className={`tab-pane fade in ${activeTab === managementTabs.gamesManaged ? 'active' : ''}`}>
    {gamesManaged.length
      ? gamesManaged.map(game =>
        <div className="row" key={game._id}>
          <GameCardManaged game={game} />
        </div>,
        )
      : <h3>עדיין לא ארגנת משחק לחברים?</h3>}
  </div>;

GamesManaged.propTypes = {
  activeTab: PropTypes.string.isRequired,
  gamesManaged: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GamesManaged;
