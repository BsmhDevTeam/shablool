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
  const jsonQuestionActions = {
    answerCount: game.answerCount,
    answersGroupCount: game.answersGroupCount,
    PlayerAnswer: game.playerAnswer,
    nextQuestion: game.nextQuestion,
  };
  const jsonPageByEvent = {
    GameInit: () => (
      gameOwner === Meteor.userId()
      ? <GameLobby
        players={game.getGamePlayersName()}
        startGame={game.startGame}
        gameCode={game.code}
      />
      : null),
    PlayerReg: () => (
      gameOwner === Meteor.userId()
      ? <GameLobby
        players={game.getGamePlayersName()}
        startGame={game.startGame}
        gameCode={game.code}
      />
      : <Instructions />),
    QuestionStart: () => (
      <Question
        id={game.lastQuestionToStartId()}
        isEnded={false}
        actions={jsonQuestionActions}
        owner={gameOwner}
      />
    ),
    PlayerAnswer: () => (
      <Question
        id={game.lastQuestionToStartId()}
        isEnded={false}
        actions={jsonQuestionActions}
      />
    ),
    QuestionEnd: () => (
      <Question
        id={game.lastQuestionToStartId()}
        isEnded
        actions={jsonQuestionActions}
      />
    ),
    GameEnd: () => <Winner winner={game.getWinner()} />,
  };
  return jsonPageByEvent[game.getLastEvent().nameType]();
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
