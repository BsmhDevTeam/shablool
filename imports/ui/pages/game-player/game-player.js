import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Leaders from '../game-shared/leaders.js';
import Question from '../game-shared/question.js';
import QuestionStatistics from '../game-shared/question-statistics';
import Winner from '../game-shared/winner';
import Instructions from './instructions.js';
import AnswerSent from './answer-sent.js';
import Loading from '../../components/loading';

const GamePlayer = ({ game }) => {
  const mapEventToPages = {
    GameInit: () => null,
    PlayerReg: () => <Instructions />,
    QuestionStart: () => <Question game={game} />,
    PlayerAnswer: () => <AnswerSent />,
    QuestionEnd: () => <QuestionStatistics game={game} />,
    ShowLeaders: () => <Leaders game={game} />,
    GameEnd: () => <Winner winner={game.getWinner()} />,
  };
  const event = game.getGamePage();
  const gameRouter = mapEventToPages[event];
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
