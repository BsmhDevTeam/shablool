// import { Meteor } from 'meteor/meteor';
// import { sinon } from 'meteor/practicalmeteor:sinon';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { Factory } from 'meteor/dburles:factory';
// import { assert, expect } from 'chai';
// import { first, sortBy } from 'underscore';
// import { eventTypes } from '/imports/startup/both/constants';
// import Game from './games.js';

// const asUser = (user) => {
//   Meteor.userId.restore();
//   sinon.stub(Meteor, 'userId', function() {
//     return user; // User id
//   });
// };

// describe('Game Helpers', function() {
//   beforeEach(function() {
//     sinon.stub(Meteor, 'userId', function() {
//       return 'owner'; // User id
//     });
//   });

//   afterEach(function() {
//     Meteor.userId.restore();
//     resetDatabase();
//   });

//   describe('isManager', function() {
//     it('should return true if the user is the game owner', function() {
//       const game = Factory.create('game');
//       expect(game.isManager()).to.be.true;
//     });

//     it('should return false if the user is not the game owner', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       expect(game.isManager()).to.be.false;
//     });
//   });

//   describe('isUserRegistered', function() {
//     it('should return true if the user has registered to the game', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       Meteor.call('joinGame', { code: game.code });
//       expect(game.isUserRegistered()).to.be.true;
//     });

//     it('should return false if the user is not in the game', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       expect(game.isUserRegistered()).to.be.true;
//     });
//   });

//   describe('getPlayersId', function() {
//     it('should return empty list if there are no users', function() {
//       const game = Factory.create('game');
//       expect(game.getPlayersId()).to.have.lengthOf(0);
//     });

//     it('should return a list of ids', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       Meteor.call('joinGame', { code: game.code });
//       expect(game.getPlayersId()).to.to.have.lengthOf(1);
//     });
//   });

//   describe('getPlayersCount', function() {
//     it('should return 0 if there are no users', function() {
//       const game = Factory.create('game');
//       expect(game.getPlayersCount()).to.have.lengthOf(0);
//     });

//     it('should return the number of players', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       Meteor.call('joinGame', { code: game.code });
//       expect(game.getPlayersCount()).to.to.have.lengthOf(1);
//     });
//   });

//   describe('getQuestionsOrder', function() {
//     it('should return the order of the question', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       Meteor.call('joinGame', { code: game.code });
//       asUser('owner');
//       game.startGame();
//       const questionStart = Game.findOne({ _id: game._id }).gameLog.filter(
//         e => e.nameType === eventTypes.QuestionStart,
//       );
//       expect(game.getQuestionsOrder(questionStart._id)).to.equal(1);
//     });
//   });

//   describe('didAllPlayersAnsweredQuestion', function() {
//     it('should return true if all players answered the question', function() {
//       const game = Factory.create('game');
//       asUser('player');
//       Meteor.call('joinGame', { code: game.code });
//       asUser('owner');
//       game.startGame();
//       asUser('player');
//       game.playerAnswer(
//         first(game.quiz.questions)._id,
//         first(first(game.quiz.questions).answers)._id,
//       );
//       asUser('owner');
//       game.questionEnd(first(game.quiz.questions)._id);
//       expect(game.isAllPlayerAnsweredToQuestion(first(game.quiz.questions)._id)).to.be.true;
//     });

//     it('should return false if not all players answered the question', function() {
//       const game = Factory.create('game');
//       asUser('playerA');
//       Meteor.call('joinGame', { code: game.code });
//       asUser('playerB');
//       Meteor.call('joinGame', { code: game.code });
//       asUser('owner');
//       game.startGame();
//       asUser('playerA');
//       game.playerAnswer(
//         first(game.quiz.questions)._id,
//         first(first(game.quiz.questions).answers)._id,
//       );
//       asUser('owner');
//       game.questionEnd(first(game.quiz.questions)._id);
//       expect(game.isAllPlayerAnsweredToQuestion(first(game.quiz.questions)._id)).to.be.false;
//     });
//   });
// });
