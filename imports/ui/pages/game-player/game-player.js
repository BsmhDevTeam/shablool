import React from 'react';
import Leaders from '../game-shared/leaders.js';
import Question from '../game-shared/question.js';
import QuestionStatistics from '../game-shared/question-statistics';
import Winner from '../game-shared/winner';
import Instructions from './instructions.js';
import AnswerSent from './answer-sent.js';
import GameClose from '../game-shared/game-close';

export default ({ game }) => {
  const mapEventToPages = {
    GameInit: () => null,
    PlayerReg: () => <Instructions />,
    QuestionStart: () => <Question game={game} />,
    PlayerAnswer: () => <AnswerSent />,
    QuestionEnd: () => <QuestionStatistics game={game} />,
    ShowLeaders: () => <Leaders game={game} />,
    GameEnd: () => <Winner game={game} />,
    GameClose: () => <GameClose />,
  };
  const event = game.getGamePage();
  const gameRouter = mapEventToPages[event];
  return gameRouter();
};
