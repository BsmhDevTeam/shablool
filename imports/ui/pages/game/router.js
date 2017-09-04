import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Game from '/imports/api/games/games';
import Loading from '/imports/ui/components/loading';
import GameManager from './owner-router.js';
import GamePlayer from './player-router.js';

const GameRouter = ({ game }) =>
  game.isManager() ? <GameManager game={game} /> : <GamePlayer game={game} />;

GameRouter.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

const GameRouterContainer = ({ loading, game }) => {
  if (loading) return <Loading color={'white'} />;
  return <GameRouter game={game} />;
};

GameRouterContainer.propTypes = {
  game: PropTypes.instanceOf(Object),
  loading: PropTypes.bool.isRequired,
};

GameRouterContainer.defaultProps = {
  game: undefined,
};

export default createContainer(({ code }) => {
  const gameHandle = Meteor.subscribe('games.get-by-code', code);
  const loading = !gameHandle.ready();
  const game = Game.findOne({ code });
  return { loading, game };
}, GameRouterContainer);
