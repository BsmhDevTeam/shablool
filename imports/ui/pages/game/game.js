import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import Instructions from '../../pages/instructions/instructions';
import Question from '../../pages/question/question';
import Winner from '../../pages/winner/winner';

const GameManager = ({ game }) => {
  const jsonQuestionActions = {
    answerCount: game.answerCount,
    answersGroupCount: game.answersGroupCount,
    PlayerAnswer: game.PlayerAnswer,
  };
  const jsonPageByEvent = {
    PlayerReg: <Instructions />,
    QuestionStart: (
      <Question
        id={game.LastQuestionToStartId()}
        isEnded={false}
        actions={jsonQuestionActions}
      />
    ),
    PlayerAnswer: (
      <Question
        id={game.LastQuestionToStartId()}
        isEnded={false}
        actions={jsonQuestionActions}
      />
    ),
    QuestionEnd: (
      <Question
        id={game.LastQuestionToStartId()}
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
