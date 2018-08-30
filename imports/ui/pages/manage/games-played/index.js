import React from 'react';
import PropTypes from 'prop-types';
import { managementTabs } from '/imports/startup/both/constants';
import GameCardPlayed from '/imports/ui/components/game-card-played';

const GamesPlayed = ({ activeTab, gamesPlayedAndGameLogs }) =>
  <div className={`tab-pane fade in ${activeTab === managementTabs.gamesPlayed ? 'active' : ''}`}>
    {gamesPlayedAndGameLogs.length
      ? gamesPlayedAndGameLogs.map(game =>
        <div className="row" key={game.game._id}>
          <GameCardPlayed game={game.game} gameLog={game.gameLog} />
        </div>,
        )
      : <h3>איך עוד לא השתתפת באף משחק ? אתה לא רציני...</h3>}
  </div>;

GamesPlayed.propTypes = {
  activeTab: PropTypes.string.isRequired,
  gamesPlayedAndGameLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GamesPlayed;
