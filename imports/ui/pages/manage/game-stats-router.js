import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Game from '/imports/api/games/games';
import Loading from '/imports/ui/components/loading';
import HistoryManager from './games-managed/games-stats.js';
import HistoryPlayer from './games-played/game-stats.js';


const HistoryRouter = ({ game }) => {
  const isManager = game.isManager();
  return isManager ? <HistoryManager game={game} /> : <HistoryPlayer game={game} />;
};

HistoryRouter.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

const HistoryRouterContainer = ({ loading, game }) => {
  if (loading) return <Loading color={'white'} />;
  return <HistoryRouter game={game} />;
};

HistoryRouterContainer.propTypes = {
  game: PropTypes.instanceOf(Object),
  loading: PropTypes.bool.isRequired,
};

export default createContainer(({ code }) => {
  const gameHandle = Meteor.subscribe('games.get-by-code', code);
  const loading = !gameHandle.ready();
  const game = Game.findOne();
  return { loading, game };
}, HistoryRouterContainer);
