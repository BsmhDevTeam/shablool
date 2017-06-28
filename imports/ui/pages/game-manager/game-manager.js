import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Leaders from '../game-shared/leaders.js';
import Question from '../game-shared/question.js';
import QuestionStatistics from '../game-shared/question-statistics';
import Winner from '../game-shared/winner';
import GameLobby from './game-lobby';

export default ({ game }) => {
  const mapEventToPages = {
    GameInit: () => <GameLobby game={game} />,
    PlayerReg: () => <GameLobby game={game} />,
    QuestionStart: () => <Question game={game} />,
    PlayerAnswer: () => <Question game={game} />,
    QuestionEnd: () => <QuestionStatistics game={game} />,
    ShowLeaders: () => <Leaders game={game} />,
    GameEnd: () => <Winner game={game} />,
    GameClose: () => FlowRouter.go('Game.Home'),
  };
  const event = game.getLastEvent().nameType;
  const gameRouter = mapEventToPages[event];
  return gameRouter();
};
