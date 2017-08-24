import { Meteor } from 'meteor/meteor';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { expect } from 'chai';
import { first, sortBy } from 'underscore';
import { eventTypes } from '/imports/startup/both/constants';
import Game from '../games.js';
import './methods';

const asUser = (user) => {
  Meteor.userId.restore();
  sinon.stub(Meteor, 'userId', function() {
    return user; // User id
  });
};

describe('Game Methods', function() {
  beforeEach(function() {
    sinon.stub(Meteor, 'userId', function() {
      return 'owner'; // User id
    });
  });

  afterEach(function() {
    Meteor.userId.restore();
    resetDatabase();
  });

  describe('initGame', function() {
    it('should create game', function() {
      const game = Factory.create('game');
      const created = Game.find({ _id: game._id });
      const collectionName = created._getCollectionName();
      const count = created.count();

      expect(collectionName).to.equal('games');
      expect(count).to.equal(1);
    });
  });

  describe('joinGame', function() {
    it('should not have players at first', function() {
      const game = Factory.create('game');
      const playersRegs = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerReg,
      );
      expect(playersRegs).to.be.empty;
    });

    it('should join game', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      const playersRegs = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerReg,
      );
      expect(playersRegs).to.have.lengthOf(1);
    });

    it('should not join twice', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      Meteor.call('joinGame', { code: game.code });
      const playersRegs = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerReg,
      );
      expect(playersRegs).to.have.lengthOf(1);
    });

    it('should not join after game start', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      const playersRegs = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerReg,
      );
      expect(playersRegs).to.have.lengthOf(1);
    });
  });

  describe('startGame', function() {
    it('should start game', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.startGame();
      const gameStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameStart,
      );
      const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      expect(gameStart).to.have.lengthOf(1);
      expect(questionStart).to.have.lengthOf(1);
    });

    it('should not start game that has no players', function() {
      const game = Factory.create('game');
      asUser('owner');
      game.startGame();
      const gameStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameStart,
      );
      const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      expect(gameStart).to.have.lengthOf(0);
      expect(questionStart).to.have.lengthOf(0);
    });
  });

  describe('gameStart', function() {
    it('should start game', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      const gameStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameStart,
      );
      expect(gameStart).to.have.lengthOf(1);
    });

    it('should not start game that has no players', function() {
      const game = Factory.create('game');
      asUser('owner');
      game.gameStart();
      const gameStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameStart,
      );
      expect(gameStart).to.have.lengthOf(0);
    });

    it('should not start game that already started', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.gameStart();
      const gameStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameStart,
      );
      expect(gameStart).to.have.lengthOf(1);
    });

    it('should not start game if not owner', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      const gameStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameStart,
      );
      expect(gameStart).to.have.lengthOf(1);
    });
  });

  describe('questionStart', function() {
    it('should start question', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      expect(questionStart).to.have.lengthOf(1);
    });

    it('should not start question that already started', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      const questionId = first(game.quiz.questions)._id;
      game.questionStart(questionId);
      game.questionStart(questionId);
      const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      expect(questionStart).to.have.lengthOf(1);
    });

    it('should not start quesion if not owner', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      asUser('player');
      game.questionStart(first(game.quiz.questions)._id);
      const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      expect(questionStart).to.have.lengthOf(0);
    });

    it('should not start quesion if another question is already running', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      const firstQuestionId = first(game.quiz.questions)._id;
      const secondQuestionId = game.quiz.questions[1]._id;
      game.questionStart(firstQuestionId);
      game.questionStart(secondQuestionId);
      const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      expect(questionStart).to.have.lengthOf(1);
    });
  });

  describe('questionEnd', function() {
    it('should end question', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      game.questionEnd(first(game.quiz.questions)._id);
      const questionEnd = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionEnd,
      );
      expect(questionEnd).to.have.lengthOf(1);
    });

    it('should not end question that already ended', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      game.questionEnd(first(game.quiz.questions)._id);
      game.questionEnd(first(game.quiz.questions)._id);
      const questionEnd = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionEnd,
      );
      expect(questionEnd).to.have.lengthOf(1);
    });

    it('should end question that has started allready', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionEnd(first(game.quiz.questions)._id);
      const questionEnd = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionEnd,
      );
      expect(questionEnd).to.have.lengthOf(0);
    });
  });

  describe('playerAnswer', function() {
    it('should log answer', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      asUser('player');
      game.playerAnswer(
        first(game.quiz.questions)._id,
        first(first(game.quiz.questions).answers)._id,
      );
      asUser('owner');
      game.questionEnd(first(game.quiz.questions)._id);
      const playerAnswer = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerAnswer,
      );
      expect(playerAnswer).to.have.lengthOf(1);
    });

    it('should not log answer multiple times to the same question', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      asUser('player');
      game.playerAnswer(
        first(game.quiz.questions)._id,
        first(first(game.quiz.questions).answers)._id,
      );
      game.playerAnswer(
        first(game.quiz.questions)._id,
        first(first(game.quiz.questions).answers)._id,
      );
      asUser('owner');
      game.questionEnd(first(game.quiz.questions)._id);
      const playerAnswer = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerAnswer,
      );
      expect(playerAnswer).to.have.lengthOf(1);
    });

    it('should not log answer for question that has not start yet', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      asUser('player');
      game.playerAnswer(
        first(game.quiz.questions)._id,
        first(first(game.quiz.questions).answers)._id,
      );
      const playerAnswer = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerAnswer,
      );
      expect(playerAnswer).to.have.lengthOf(0);
    });

    it('should not log answer for question that has already ended', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      game.questionEnd(first(game.quiz.questions)._id);
      asUser('player');
      game.playerAnswer(
        first(game.quiz.questions)._id,
        first(first(game.quiz.questions).answers)._id,
      );
      const playerAnswer = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerAnswer,
      );
      expect(playerAnswer).to.have.lengthOf(0);
    });

    it('should not log answer if manager has answer', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.questionStart(first(game.quiz.questions)._id);
      game.playerAnswer(
        first(game.quiz.questions)._id,
        first(first(game.quiz.questions).answers)._id,
      );
      game.questionEnd(first(game.quiz.questions)._id);
      const playerAnswer = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerAnswer,
      );
      expect(playerAnswer).to.have.lengthOf(0);
    });
  });

  describe('endGame', function() {
    it('should end game', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.endGame();
      const endGame = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameEnd,
      );
      expect(endGame).to.have.lengthOf(1);
    });

    it('should not end game that has not start yet', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.endGame();
      const endGame = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameEnd,
      );
      expect(endGame).to.have.lengthOf(0);
    });

    it('should not end game twice', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.endGame();
      game.endGame();
      const endGame = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameEnd,
      );
      expect(endGame).to.have.lengthOf(1);
    });
  });

  describe('closeGame', function() {
    it('should close game', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.closeGame();
      const closeGame = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameClose,
      );
      expect(closeGame).to.have.lengthOf(1);
    });

    it('should not close game twice', function() {
      const game = Factory.create('game');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      game.closeGame();
      game.closeGame();
      const closeGame = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.GameClose,
      );
      expect(closeGame).to.have.lengthOf(1);
    });
  });

  describe('endQuestionIfEveryoneAnswered', function() {
    it('should end question', function() {
      const game = Factory.create('game');
      asUser('player1');
      Meteor.call('joinGame', { code: game.code });
      asUser('player2');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      const question = first(sortBy(game.quiz.questions, 'order'));
      game.questionStart(question._id);
      asUser('player1');
      game.playerAnswer(question._id, first(question.answers)._id);
      asUser('player2');
      game.playerAnswer(question._id, first(question.answers)._id);
      const questionEnd = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionEnd && e.questionId === question._id,
      );
      const playerAnswer = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.PlayerAnswer,
      );
      expect(questionEnd).to.have.lengthOf(1);
      expect(playerAnswer).to.have.lengthOf(2);
    });

    it('should not end question', function() {
      const game = Factory.create('game');
      asUser('player1');
      Meteor.call('joinGame', { code: game.code });
      asUser('player2');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.gameStart();
      const question = first(sortBy(game.quiz.questions, 'order'));
      game.questionStart(question._id);
      asUser('player1');
      game.playerAnswer(question._id, first(question.answers)._id);
      const questionEnd = Game.findOne({ _id: game._id }).gameLog.filter(
        e => e.nameType === eventTypes.QuestionEnd && e.questionId === question._id,
      );
      expect(questionEnd).to.have.lengthOf(0);
    });
  });
});
