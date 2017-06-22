import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Leaders from '../game-shared/leaders.js';
import Question from '../game-shared/question.js';
import QuestionStatistics from '../game-shared/question-statistics';
import Winner from '../game-shared/winner';
import GameLobby from './game-lobby';
import Loading from '../../components/loading';


const GameManager = ({ game }) => {
  const mapEventToPages = {
    GameInit: () => <GameLobby game={game} />,
    PlayerReg: () => <GameLobby game={game} />,
    QuestionStart: () => <Question game={game} />,
    PlayerAnswer: () => <Question game={game} />,
    QuestionEnd: () => <QuestionStatistics game={game} />,
    ShowLeaders: () => <Leaders game={game} />,
    GameEnd: () => <Winner winner={game.getWinner()} />,
  };
  const event = game.getLastEvent().nameType;
  const gameRouter = mapEventToPages[event];
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
