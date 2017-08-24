import React from 'react';
import PropTypes from 'prop-types';
import { managementTabs } from '/imports/startup/both/constants';
import GameCardPlayed from '/imports/ui/components/game-card-played';

const GamesPlayed = ({ activeTab, gamesPlayed }) =>
  <div className={`tab-pane fade in ${activeTab === managementTabs.gamesPlayed ? 'active' : ''}`}>
    {gamesPlayed.length
      ? gamesPlayed.map(game =>
        <div className="row" key={game._id}>
          <GameCardPlayed game={game} />
        </div>,
        )
      : <h3>איך עוד לא השתתפת באף משחק ? אתה לא רציני...</h3>}
  </div>;

GamesPlayed.propTypes = {
  activeTab: PropTypes.string.isRequired,
  gamesPlayed: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GamesPlayed;
