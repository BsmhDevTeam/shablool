import React from 'react';
import { eventTypes } from '/imports/startup/both/constants';
import Leaders from '../game-shared/leaders.js';
import Question from '../game-shared/question.js';
import QuestionStatistics from '../game-shared/question-statistics';
import Winner from '../game-shared/winner';
import Instructions from './instructions.js';
import AnswerSent from './answer-sent.js';
import GameClose from '../game-shared/game-close';

export default ({ game }) => {
  const mapEventToPages = (event) => {
    switch (event) {
      case eventTypes.GameInit:
        return null;
      case eventTypes.PlayerReg:
        return <Instructions />;
      case eventTypes.GameStart:
        return <Instructions />;
      case eventTypes.QuestionStart:
        return <Question game={game} />;
      case eventTypes.PlayerAnswer:
        return <AnswerSent />;
      case eventTypes.QuestionEnd:
        return <QuestionStatistics game={game} />;
      case eventTypes.ShowLeaders:
        return <Leaders game={game} />;
      case eventTypes.GameEnd:
        return <Winner game={game} />;
      case eventTypes.GameClose:
        return <GameClose />;
      default:
        return null;
    }
  };
  const event = game.getGamePage();
  return mapEventToPages(event);
};
