import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Instructions from '../../pages/instructions/instructions';
import Question from '../../pages/question/question';
import Winner from '../../pages/winner/winner';
import GameLobby from '../../pages/game-lobby/game-lobby';

const GameManager = ({ game }) => {
  const gameOwner = game.quiz.owner;
  const jsonPageByEvent = {
    GameInit: () => (
      gameOwner === Meteor.userId()
      ? <GameLobby
        game={game}
      />
      : null),
    PlayerReg: () => (
      gameOwner === Meteor.userId()
      ? <GameLobby
        game={game}
      />
      : <Instructions />),
    QuestionStart: () => (
      <Question
        game={game}
        isEnded={false}
      />
    ),
    PlayerAnswer: () => (
      <Question
        game={game}
        isEnded={false}
      />
    ),
    QuestionEnd: () => (
      <Question
        game={game}
        isEnded
      />
    ),
    GameEnd: () => <Winner winner={game.getWinner()} />,
  };
  const type = game.getLastEvent().nameType;
  const gameRouter = jsonPageByEvent[type];
  return gameRouter();
};

const GameManagerContainer = ({ loading, game }) => {
  if (loading) return <p>loading</p>;
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
