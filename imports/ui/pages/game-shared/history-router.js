import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import HistoryManager from '../game-manager/history-manager';
import HistoryPlayer from '../game-player/history-player';
import Loading from '../../components/loading';

const HistoryRouter = ({ game }) => {
  const isManager = game.quiz.owner === Meteor.userId();
  return isManager ? <HistoryManager game={game} /> : <HistoryPlayer game={game} />;
};

const HistoryRouterContainer = ({ loading, game }) => {
  if (loading) return <Loading color={'white'} />;
  return <HistoryRouter game={game} />;
};

export default createContainer(({ code }) => {
  const usersHandle = Meteor.subscribe('users.names');
  const gameHandle = Meteor.subscribe('games.get-by-code', code);
  const loading = !gameHandle.ready() || !usersHandle.ready();
  const game = Game.findOne();
  return { loading, game };
}, HistoryRouterContainer);
