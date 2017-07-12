import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import uuidV4 from 'uuid/v4';
import Quiz, { Question, Answer } from '../../quizes/quizes';
import Game, { GameInit, eventTypes, QuestionEnd } from '../games.js';
import './methods';

describe('games methods', function () {
    beforeEach(function () {
        sinon.stub(Meteor, "userId" , function() {
            return '1234'; // User id
        });
        Game.remove({});
    });

    afterEach(function () {
        Meteor.userId.restore();
    });

    describe('Games collection', function () {
        it('create correctly', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [],
                    tags: ['tag'],
                    owner: Meteor.userId(),
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const created = Game.find({ _id: id });
            const collectionName = created._getCollectionName();
            const count = created.count();

            assert.equal(collectionName, 'games');
            assert.equal(count, 1);
        });
    });

    describe('Games collection', function () {
        it('checking PlayerReg', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            const newGamePlayerReg = Game.findOne({ _id: id });
            assert.equal(newGamePlayerReg.gameLog.length, 2);
        });

        it('manager try to do PlayerReg', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [],
                    tags: ['tag'],
                    owner: Meteor.userId(),
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            const newGamePlayerReg = Game.findOne({ _id: id });
            assert.equal(newGamePlayerReg.gameLog.length, 1);
        });
    });

    describe('Games collection', function () {
        it('try to start game without any players', function () {
             const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [],
                    tags: ['tag'],
                    owner: Meteor.userId(),
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            const isStart = newGameFromDB.startGame();

            assert.equal(isStart, false);
            assert.equal(newGameFromDB.gameLog.length, 1);
        });

        it('try to start game in a middle of a game', function () {
             const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [new Question({
                        _id: uuidV4(),
                        text: 'WhatsUp ?!',
                        answers: [
                            new Answer({
                                _id: uuidV4(),
                                text: 'good',
                                order: 1,
                                points: 10,
                            }),
                            new Answer({
                                _id: uuidV4(),
                                text: 'bad',
                                order: 2,
                                points: 0,
                            }),
                            new Answer({
                                _id: uuidV4(),
                                text: 'Awsome',
                                order: 3,
                                points: 100,
                            }),
                            new Answer({
                                _id: uuidV4(),
                                text: '...',
                                order: 4,
                                points: 0,
                        })],
                        order: 1,
                        time: 10,
                    })],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            newGameFromDB.startGame();
            const isStart = newGameFromDB.startGame();
            console.log('newGameFromDB:\n', newGameFromDB);
            const newGameFromDB1 = Game.findOne({ _id: id });
            console.log('newGameFromDB1:\n', newGameFromDB1);
            assert.equal(isStart, false);
            assert.equal(newGameFromDB1.gameLog.length, 3);
        });
    });

    describe('Games collection', function () {
        it('adding questionEnd to gameLog', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [new Question({
                        _id: uuidV4(),
                        text: 'WhatsUp ?!',
                        answers: [
                            new Answer({
                                _id: uuidV4(),
                                text: 'good',
                                order: 1,
                                points: 10,
                            }),
                            new Answer({
                                _id: uuidV4(),
                                text: 'bad',
                                order: 2,
                                points: 0,
                            }),
                            new Answer({
                                _id: uuidV4(),
                                text: 'Awsome',
                                order: 3,
                                points: 100,
                            }),
                            new Answer({
                                _id: uuidV4(),
                                text: '...',
                                order: 4,
                                points: 0,
                        })],
                        order: 1,
                        time: 10,
                    })],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.questionEnd(newGameFromDB.quiz.questions[0]._id);
            const newGameQuestionEnd = Game.findOne({ _id: id });
            assert.equal(newGameQuestionEnd.gameLog.length, 2);
        });
    });

    describe('Games collection', function () {
        it('player try to answer on the same quesion more than once', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [new Question({
                        _id: 'qId',
                        text: 'WhatsUp ?!',
                        answers: [
                            new Answer({
                                _id: 'a1Id',
                                text: 'good',
                                order: 1,
                                points: 10,
                            }),
                            new Answer({
                                _id: 'a2Id',
                                text: 'bad',
                                order: 2,
                                points: 0,
                            }),
                            new Answer({
                                _id: 'a3Id',
                                text: 'Awsome',
                                order: 3,
                                points: 100,
                            }),
                            new Answer({
                                _id: 'a4Id',
                                text: '...',
                                order: 4,
                                points: 0,
                        })],
                        order: 1,
                        time: 10,
                    })],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            newGameFromDB.startGame();
            newGameFromDB.playerAnswer(Meteor.userId(), 'qId', 'a1Id');
            newGameFromDB.playerAnswer(Meteor.userId(), 'qId', 'a2Id');
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
            assert.equal(playerAnswerEvents.length, 1);
        });

        it('player try to answer on a question that has already ended', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [new Question({
                        _id: 'qId',
                        text: 'WhatsUp ?!',
                        answers: [
                            new Answer({
                                _id: 'a1Id',
                                text: 'good',
                                order: 1,
                                points: 10,
                            }),
                            new Answer({
                                _id: 'a2Id',
                                text: 'bad',
                                order: 2,
                                points: 0,
                            }),
                            new Answer({
                                _id: 'a3Id',
                                text: 'Awsome',
                                order: 3,
                                points: 100,
                            }),
                            new Answer({
                                _id: 'a4Id',
                                text: '...',
                                order: 4,
                                points: 0,
                        })],
                        order: 1,
                        time: 10,
                    })],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            newGameFromDB.startGame();
            newGameFromDB.gameLog.concat([new QuestionEnd({ questionId: 'qId' })]);
            newGameFromDB.save();
            newGameFromDB.playerAnswer(Meteor.userId(), 'qId', 'a1Id');
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
            assert.equal(playerAnswerEvents.length, 0);
        });

        it('player try to answer on a question that has not started yet', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [new Question({
                        _id: 'qId',
                        text: 'WhatsUp ?!',
                        answers: [
                            new Answer({
                                _id: 'a1Id',
                                text: 'good',
                                order: 1,
                                points: 10,
                            }),
                            new Answer({
                                _id: 'a2Id',
                                text: 'bad',
                                order: 2,
                                points: 0,
                            }),
                            new Answer({
                                _id: 'a3Id',
                                text: 'Awsome',
                                order: 3,
                                points: 100,
                            }),
                            new Answer({
                                _id: 'a4Id',
                                text: '...',
                                order: 4,
                                points: 0,
                        })],
                        order: 1,
                        time: 10,
                    })],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            newGameFromDB.playerAnswer(Meteor.userId(), 'qId', 'a1Id');
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
            assert.equal(playerAnswerEvents.length, 0);
        });
    });

    describe('Games collection', function () {
        it('nextQuestion() works fine', function () {
            const newGame = new Game({
                quiz: new Quiz({
                    title: 'test quiz',
                    questions: [
                        new Question({
                            _id: 'q1Id',
                            text: 'first question',
                            answers: [
                                new Answer({
                                    _id: 'a11Id',
                                    text: 'answer11',
                                    order: 1,
                                    points: 10,
                                }),
                                new Answer({
                                    _id: 'a12Id',
                                    text: 'answer12',
                                    order: 2,
                                    points: 0,
                                }),
                                new Answer({
                                    _id: 'a13Id',
                                    text: 'answer13',
                                    order: 3,
                                    points: 100,
                                }),
                                new Answer({
                                    _id: 'a14Id',
                                    text: 'answer14',
                                    order: 4,
                                    points: 0,
                            })],
                            order: 1,
                            time: 10,
                        }),
                        new Question({
                            _id: 'q2Id',
                            text: 'second question',
                            answers: [
                                new Answer({
                                    _id: 'a21Id',
                                    text: 'answer21',
                                    order: 1,
                                    points: 10,
                                }),
                                new Answer({
                                    _id: 'a22Id',
                                    text: 'answer22',
                                    order: 2,
                                    points: 0,
                                }),
                                new Answer({
                                    _id: 'a23Id',
                                    text: 'answer23',
                                    order: 3,
                                    points: 100,
                                }),
                                new Answer({
                                    _id: 'a24Id',
                                    text: 'answer24',
                                    order: 4,
                                    points: 0,
                            })],
                            order: 2,
                            time: 10,
                        })],
                    tags: ['tag'],
                    owner: 'owner',
                    }),
                gameLog: [new GameInit()],
            });
            const id = newGame.initGame();
            const newGameFromDB = Game.findOne({ _id: id });
            newGameFromDB.playerRegister();
            newGameFromDB.playerRegister();
            newGameFromDB.startGame();
            newGameFromDB.playerAnswer(Meteor.userId(), 'q1Id', 'a1Id');
            newGameFromDB.nextQuestion();
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog
                .filter(e => e.nameType === eventTypes.QuestionStart)
                .filter(e => e.questionId === 'q2Id');
            assert.equal(playerAnswerEvents.length, 1);
        });
    });
});
