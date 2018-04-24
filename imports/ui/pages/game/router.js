import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Game from '/imports/api/games/games';
import Loading from '/imports/ui/components/loading';
import GameManager from './owner-router.js';
import GamePlayer from './player-router.js';
import GameLog from '../../../api/gamelogs/gamelogs';

const GameRouter = ({ game, gameLog }) => {
  return game.isManager() ?
    <GameManager game={game} gameLog={gameLog} />
  : <GamePlayer game={game} gameLog={gameLog} />;
};

GameRouter.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
  gameLog: PropTypes.arrayOf(Object).isRequired,
};

const GameRouterContainer = ({ loading, game, gameLog }) => {
  if (loading) return <Loading color={'white'} />;
  return <GameRouter game={game} gameLog={gameLog} />;
};

GameRouterContainer.propTypes = {
  game: PropTypes.instanceOf(Object),
  gameLog: PropTypes.arrayOf(Object),
  loading: PropTypes.bool.isRequired,
};

GameRouterContainer.defaultProps = {
  game: undefined,
  gameLog: [],
};


const createGameLogContainer = createContainer(({ loading, game }) => {
  if (loading) return <Loading color={'white'} />;
  const gamelogHandle = Meteor.subscribe('gamelogs.get-by-gameid', game._id);
  console.log('gamelogHandle:', gamelogHandle.ready());
  const gameLog = GameLog.find({ gameId: game._id }).map(o => o.event);
  console.log('gamelogs counter: ', gameLog);
  return { loading: !gamelogHandle.ready(), game, gameLog }
}, GameRouterContainer);

createGameLogContainer.propTypes = {
  game: PropTypes.instanceOf(Object),
  loading: PropTypes.bool.isRequired,
};

createGameLogContainer.defaultProps = {
  game: undefined,
};

export default createContainer(({ code }) => {
  console.log('code: ', code);
  const gameHandle = Meteor.subscribe('games.get-by-code', code);
  console.log('gameHandle:', gameHandle.ready());
  const loading = !gameHandle.ready();
  const game = Game.findOne({ code });
  console.log('game: ', game);
  return { loading, game };
}, createGameLogContainer);
