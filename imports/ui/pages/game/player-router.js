import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { eventTypes } from '/imports/startup/both/constants';
import Loading from '/imports/ui/components/loading';
import Leaders from './both/leaders.js';
import Question from './both/question.js';
import QuestionStatistics from './both/question-statistics';
import Winner from './both/winner';
import Instructions from './player/instructions.js';
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
        return <QuestionStatistics code={game.code} />;
      case eventTypes.ShowLeaders:
        return <Leaders code={game.code} />;
      case eventTypes.GameEnd:
        return <Winner code={game.code} />;
      case eventTypes.GameClose:
        return <GameClose />;
      default:
        return null;
    }
  };
  const event = game.getGamePage();
  return mapEventToPages(event);
};
