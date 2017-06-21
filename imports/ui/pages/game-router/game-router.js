import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Loading from '../../components/loading/loading';
import GameManager from '../game-manager/game-manager';
import GamePlayer from '../game-player/game-player';

const GameRouter = ({ game }) => {
  const isManager = game.quiz.owner === Meteor.userId();
  return isManager ? <GameManager game={game} /> : <GamePlayer game={game} />;
};

const GameRouterContainer = ({ loading, game }) => {
  if (loading) return <Loading />;
  return <GameRouter game={game} />;
};

export default createContainer(({ code }) => {
  const usersHandle = Meteor.subscribe('users.names');
  const gameHandle = Meteor.subscribe('games.getByCode', code);
  const loading = !gameHandle.ready() || !usersHandle.ready();
  const game = Game.findOne();
  return {
    loading,
    game,
  };
}, GameRouterContainer);
