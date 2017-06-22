import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Leaders from '../leaders/leaders';
import Instructions from '../instructions/instructions';
import Question from '../question/question';
import QuestionStatistics from '../question-statistics/question-statistics';
import Winner from '../winner/winner';
import Loading from '../../components/loading/loading';
import AnswerSent from '../answer-sent/answer-sent';

const GamePlayer = ({ game }) => {
  const jsonPageByEvent = {
    GameInit: () => null,
    PlayerReg: () => <Instructions />,
    QuestionStart: () => (
      <Question
        game={game}
      />
    ),
    PlayerAnswer: () => (
      <AnswerSent />
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
  console.log('gameLog-player:');
  console.log(game.gameLog);
  const type = game.getGamePage();
  console.log('type');
  console.log(type);
  const gameRouter = jsonPageByEvent[type];
  return gameRouter();
};

const GamePlayerContainer = ({ loading, game }) => {
  if (loading) return <Loading />;
  return <GamePlayer game={game} />;
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
}, GamePlayerContainer);
