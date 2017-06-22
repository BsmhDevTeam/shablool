import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Leaders from '../leaders/leaders';
import Question from '../question/question';
import QuestionStatistics from '../question-statistics/question-statistics';
import Winner from '../winner/winner';
import GameLobby from '../game-lobby/game-lobby';
import Loading from '../../components/loading/loading';

const GameManager = ({ game }) => {
  const jsonPageByEvent = {
    GameInit: () => (
      <GameLobby
        game={game}
      />
    ),
    PlayerReg: () => (
      <GameLobby
        game={game}
      />
    ),
    QuestionStart: () => (
      <Question
        game={game}
      />
    ),
    PlayerAnswer: () => (
      <Question
        game={game}
      />
    ),
    QuestionEnd: () => (
      <QuestionStatistics
        game={game}
      />
    ),
    ShowLeaders: () => (
      <Leaders
        game={game}
      />
    ),
    GameEnd: () => (
      <Winner
        winner={game.getWinner()}
      />
    ),
  };
  console.log('gameLog-manager:');
  console.log(game.gameLog);
  const type = game.getLastEvent().nameType;
  const gameRouter = jsonPageByEvent[type];
  return gameRouter();
};

const GameManagerContainer = ({ loading, game }) => {
  if (loading) return <Loading />;
  return <GameManager game={game} />;
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
}, GameManagerContainer);
