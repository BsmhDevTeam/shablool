import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Leaders from '../game-shared/leaders.js';
import Question from '../game-shared/question.js';
import QuestionStatistics from '../game-shared/question-statistics';
import Winner from '../game-shared/winner';
import Instructions from './instructions.js';
import AnswerSent from './answer-sent.js';

export default ({ game }) => {
  const mapEventToPages = {
    GameInit: () => null,
    PlayerReg: () => <Instructions />,
    QuestionStart: () => <Question game={game} />,
    PlayerAnswer: () => <AnswerSent />,
    QuestionEnd: () => <QuestionStatistics game={game} />,
    ShowLeaders: () => <Leaders game={game} />,
    GameEnd: () => <Winner game={game} />,
    GameClose: () => FlowRouter.go('Game.Home'),
  };
  const event = game.getGamePage();
  const gameRouter = mapEventToPages[event];
  return gameRouter();
};
