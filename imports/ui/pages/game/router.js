import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Game from '/imports/api/games/games';
import Loading from '/imports/ui/components/loading';
import GameManager from './owner-router.js';
import GamePlayer from './player-router.js';
import GameLog from '../../../api/gamelogs/gamelogs';

const GameRouter = ({ game, gameLog, players }) => game.isManager() ?
    <GameManager game={game} gameLog={gameLog} players={players} />
  : <GamePlayer game={game} gameLog={gameLog} players={players} />;

GameRouter.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
  gameLog: PropTypes.arrayOf(Object).isRequired,
  players: PropTypes.arrayOf(String).isRequired,
};

const GameRouterContainer = ({ loading, game, gameLog, players }) => {
  if (loading) return <Loading color={'white'} />;
  return <GameRouter game={game} gameLog={gameLog} players={players} />;
};

GameRouterContainer.propTypes = {
  game: PropTypes.instanceOf(Object),
  gameLog: PropTypes.arrayOf(Object),
  players: PropTypes.arrayOf(String),
  loading: PropTypes.bool.isRequired,
};

GameRouterContainer.defaultProps = {
  game: undefined,
  gameLog: [],
  players: [],
};


const createGameLogContainer = createContainer(({ loading, game }) => {
  if (loading) return <Loading color={'white'} />;
  const gamelogHandle = Meteor.subscribe('gamelogs.get-by-gameid', game._id);
  const gameLog = GameLog.find({ gameId: game._id }).map(o => o.event);
  const players = game.getPlayersName(gameLog);
  return { loading: !gamelogHandle.ready(), game, gameLog, players };
}, GameRouterContainer);

createGameLogContainer.propTypes = {
  game: PropTypes.instanceOf(Object),
  loading: PropTypes.bool.isRequired,
};

createGameLogContainer.defaultProps = {
  game: undefined,
};

export default createContainer(({ code }) => {
  const gameHandle = Meteor.subscribe('games.get-by-code', code);
  const loading = !gameHandle.ready();
  const game = Game.findOne({ code });
  return { loading, game };
}, createGameLogContainer);
