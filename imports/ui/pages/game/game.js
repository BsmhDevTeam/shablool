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
    PlayerAnswer: game.PlayerAnswer,
    nextQuestion: game.NextQuestion,
  };
  const jsonPageByEvent = {
    GameInit: gameOwner === Meteor.user()
      ? <GameLobby
        players={game.getGamePlayersName()}
        startGame={game.startGame}
        gameCode={game.code}
      />
      : '',
    PlayerReg: <Instructions />,
    QuestionStart: (
      <Question
        id={game.lastQuestionToStartId()}
        isEnded={false}
        actions={jsonQuestionActions}
        owner={gameOwner}
      />
    ),
    PlayerAnswer: (
      <Question
        id={game.lastQuestionToStartId()}
        isEnded={false}
        actions={jsonQuestionActions}
      />
    ),
    QuestionEnd: (
      <Question
        id={game.lastQuestionToStartId()}
        isEnded
        actions={jsonQuestionActions}
      />
    ),
    GameEnd: <Winner winner={game.getWinner()} />,
  };
  return jsonPageByEvent[game.getLastEvent];
};

const GameManagerContainer = ({ loading }) => {
  if (loading) return <p>loading</p>;
  const game = Game.findOne();
  return <GameManager game={game} />;
};

export default createContainer(({ id }) => {
  const gameHandle = Meteor.subscribe('games.get', id);
  const loading = !gameHandle.ready();
  return {
    loading,
  };
}, GameManagerContainer);
