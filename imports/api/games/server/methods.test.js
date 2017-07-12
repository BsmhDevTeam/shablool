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

    describe('initGame', function () {
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

    describe('playerRegister', function () {
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

    describe('startGame', function () {
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
            const newGameFromDB1 = Game.findOne({ _id: id });
            assert.equal(isStart, false);
            assert.equal(newGameFromDB1.gameLog.length, 3);
        });
    });

    describe('questionEnd', function () {
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

    describe('playerAnswer', function () {
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

    describe('nextQuestion', function () {
        it('check if works correctly', function () {
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
            newGameFromDB.startGame();
            newGameFromDB.playerAnswer(Meteor.userId(), 'q1Id', 'a11Id');
            newGameFromDB.nextQuestion();
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog
                .filter(e => e.nameType === eventTypes.QuestionStart)
                .filter(e => e.questionId === 'q2Id');
            assert.equal(playerAnswerEvents.length, 1);
        });
    });

    describe('showLeaders', function () {
        it('showLeaders event adding correctly', function () {
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
            const created = Game.findOne({ _id: id });
            created.showLeaders();
            
            const newGameFromDB = Game.findOne({ _id: id });
            const showLeadersEvents = newGameFromDB.gameLog
                .filter(e => e.nameType === eventTypes.ShowLeaders)
            assert.equal(showLeadersEvents.length, 1);
        });
    });

    describe('endGame', function () {
        it('GameEnd event adding correctly', function () {
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
            const created = Game.findOne({ _id: id });
            created.endGame();

            const newGameFromDB = Game.findOne({ _id: id });
            const gameEndEvents = newGameFromDB.gameLog
                .filter(e => e.nameType === eventTypes.GameEnd);
            assert.equal(gameEndEvents.length, 1);
        });
    });

    describe('endGameOrNextQuestion', function () {
        it('endGameOrNextQuestion() needs to call nextQuestion()', function () {
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
            newGameFromDB.startGame();
            newGameFromDB.playerAnswer(Meteor.userId(), 'q1Id', 'a11Id');
            newGameFromDB.endGameOrNextQuestion();
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog
                .filter(e => e.nameType === eventTypes.QuestionStart)
                .filter(e => e.questionId === 'q2Id');
            assert.equal(playerAnswerEvents.length, 1);
        });

        it('endGameOrNextQuestion() needs to call nextQuestion()', function () {
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
            newGameFromDB.startGame();
            newGameFromDB.playerAnswer(Meteor.userId(), 'q1Id', 'a11Id');
            newGameFromDB.questionEnd('q1Id');
            newGameFromDB.showLeaders();
            newGameFromDB.endGameOrNextQuestion();
            newGameFromDB.playerAnswer(Meteor.userId(), 'q2Id', 'a21Id');
            newGameFromDB.endGameOrNextQuestion();
            const newGamePlayerAnswer = Game.findOne({ _id: id });
            const playerAnswerEvents = newGamePlayerAnswer.gameLog
                .filter(e => e.nameType === eventTypes.GameEnd);
            assert.equal(playerAnswerEvents.length, 1);
        });
    });

    describe('closeGame', function () {
        it('GameClose event adding correctly', function () {
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
            const created = Game.findOne({ _id: id });
            created.closeGame();

            const newGameFromDB = Game.findOne({ _id: id });
            const gameCloseEvents = newGameFromDB.gameLog
                .filter(e => e.nameType === eventTypes.GameClose);
            assert.equal(gameCloseEvents.length, 1);
        });
    });

    describe('isQuestionEndAlready', function () {
        it('isQuestionEndAlready with question that has start', function () {
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
            newGameFromDB.questionEnd('qId');
            const created = Game.findOne({ _id: id });
            isQuestionEnd = created.isQuestionEndAlready('qId');

            assert.equal(isQuestionEnd, true);
        });

        it('isQuestionEndAlready with question that has not start yet', function () {
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
            const created = Game.findOne({ _id: id });
            isQuestionEnd = created.isQuestionEndAlready('qId');

            assert.equal(isQuestionEnd, false);
        });

        it('isQuestionEndAlready with question that not exist', function () {
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
            const created = Game.findOne({ _id: id });
            isQuestionEnd = created.isQuestionEndAlready('fake_id');

            assert.equal(isQuestionEnd, false);
        });
    });
});
