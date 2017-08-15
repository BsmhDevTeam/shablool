import React from 'react';
import { eventTypes } from '/imports/startup/both/constants';
import Leaders from './both/leaders.js';
import Question from './both/question.js';
import QuestionStatistics from './both/question-statistics';
import Winner from './both/winner';
import Instructions from './player/instructions';
import AnswerSent from './player/answer-sent.js';
import GameClose from './both/game-close';

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
  const event = game.getGamePage().nameType;
  return mapEventToPages(event);
};
