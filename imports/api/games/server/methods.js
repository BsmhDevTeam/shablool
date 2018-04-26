import { Meteor } from 'meteor/meteor';
import { max } from 'underscore';
import { check } from 'meteor/check';
import { eventTypes, joinGameResults } from '/imports/startup/both/constants';
import Game, {
  GameInit,
  PlayerReg,
  GameStart,
  QuestionStart,
  QuestionEnd,
  PlayerAnswer,
  ShowLeaders,
  GameEnd,
  GameClose,
} from '../games';
import GameLog from '../../gamelogs/gamelogs';

Game.extend({
  meteorMethods: {
    initGame() {
      this.save();
      GameLog.insert({ gameId: this._id, event: new GameInit() });
      return this;
    },
    startGame() {
      // Starting game
      this.gameStart();
      // Starting first question
      const firstQuestion = this.quiz.questions.find(q => q.order === 1);
      this.questionStart(firstQuestion._id);
      // Ending question
      const questionEndToLog = () => {
        this.questionEnd(firstQuestion._id);
      };
      Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
      // Closing Game
      const closeGameToLog = () => this.closeGame();
      Meteor.setTimeout(closeGameToLog, 24 * 60 * 60 * 1000); // close game after 24H
    },
    gameStart() {
      const isAnyPlayerReg = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.PlayerReg } },
        ],
      }).count();
      const isGameAlreadyStarted = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.GameStart } },
        ],
      }).count();
      const addGameStartEvent = () => {
        GameLog.insert({ gameId: this._id, event: new GameStart() });
      };
      isAnyPlayerReg && !isGameAlreadyStarted && this.isManager() && addGameStartEvent();
    },
    questionStart(qId) {
      const isGameAlreadyStarted = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.GameStart } },
        ],
      }).count();
      const isQuestionStart = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionStart } },
          { 'event.questionId': { $eq: qId } },
        ],
      }).count();
      const addQuestionStartEvent = () => {
        GameLog.insert({ gameId: this._id, event: new QuestionStart({ questionId: qId }) });
      };
      isGameAlreadyStarted && !isQuestionStart && this.isManager() && addQuestionStartEvent();
    },
    questionEnd(qId) {
      const isQuestionStart = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionStart } },
          { 'event.questionId': { $eq: qId } },
        ],
      }).count();
      const isQuestionEnd = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionEnd } },
          { 'event.questionId': { $eq: qId } },
        ],
      }).count();
      const addQuestionEndEvent = () => {
        GameLog.insert({ gameId: this._id, event: new QuestionEnd({ questionId: qId }) });
      };
      isQuestionStart && !isQuestionEnd && addQuestionEndEvent();
    },
    skipQuestion(qId) {
      GameLog.insert({ gameId: this._id, event: new QuestionEnd({ questionId: qId }) });
      GameLog.insert({ gameId: this._id, event: new ShowLeaders() });
    },
    playerAnswer(qId, aId) {
      const isQuestionStart = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionStart } },
          { 'event.questionId': { $eq: qId } },
        ],
      }).count();
      const isQuestionEnd = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionEnd } },
          { 'event.questionId': { $eq: qId } },
        ],
      }).count();
      const isPlayerAnswered = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.PlayerAnswer } },
          { 'event.playerId': { $eq: Meteor.userId() } },
          { 'event.questionId': { $eq: qId } },
        ],
      }).count();
      const isPlayerReg = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.PlayerReg } },
          { 'event.playerId': { $eq: Meteor.userId() } },
        ],
      }).count();
      const addPlayerAnswerEvent = () => {
        GameLog.insert({ gameId: this._id,
          event: new PlayerAnswer({ playerId: Meteor.userId(), questionId: qId, answerId: aId }),
        });
      };
      isPlayerReg && isQuestionStart && !isPlayerAnswered && !isQuestionEnd && addPlayerAnswerEvent();
      const gameLog = GameLog.find({ gameId: this._id }).map(o => o.event);
      const isEveryoneAnswered = this.isAllPlayerAnsweredToQuestion(qId, gameLog);
      return isEveryoneAnswered && this.questionEnd(qId);
    },
    nextQuestion() {
      // start question
      const qId = this.nextQuestionId();
      this.questionStart(qId);
      // end question
      const q = this.quiz.questions.find(ques => ques._id === qId);
      const questionEndToLog = () => {
        this.questionEnd(qId);
      };
      Meteor.setTimeout(questionEndToLog, q.time * 1000);
      return true;
    },
    showLeaders() {
      GameLog.insert({ gameId: this._id, event: new ShowLeaders() });
    },
    endGame() {
      const isGameEnded = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.GameEnd } },
        ],
      }).count();
      const isGameStarted = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.GameStart } },
        ],
      }).count();
      const addGameEndEvent = () => {
        GameLog.insert({ gameId: this._id, event: new GameEnd() });
      };
      isGameStarted && !isGameEnded && this.isManager() && addGameEndEvent();
    },
    endGameOrNextQuestion() {
      console.log('endGameOrNextQuestion');
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      console.log('lastQuestionOrder: ', lastQuestionOrder);
      const gameLog = GameLog.find({ gameId: this._id }).map(o => o.event);
      return lastQuestionOrder === this.lastQuestionToEnd(gameLog).order
        ? this.endGame()
        : this.nextQuestion();
    },
    closeGame() {
      const isGameClosed = !!GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.GameClose } },
        ],
      }).count();
      const addGameCloseEvent = () => {
        GameLog.insert({ gameId: this._id, event: new GameClose() });
      };
      !isGameClosed && this.isManager() && addGameCloseEvent();
    },
  },
});

Meteor.methods({
  // Methods without instance:
  joinGame({ code }) {
    check(code, String);

    const currGame = Game.findOne({ code });
    const gameLog = GameLog.find({ gameId: currGame._id }).map(o => o.event);
    if (!Meteor.userId()) {
      return joinGameResults.noUserId;
    } else if (!currGame) {
      return joinGameResults.noGame;
    } else if (currGame.isManager()) {
      return joinGameResults.isManager;
    } else if (currGame.isUserRegistered(gameLog)) {
      return joinGameResults.alreadyRegistered;
    } else if (GameLog.find({
      $and: [
        { gameId: { $eq: currGame._id } },
        { 'event.nameType': { $eq: eventTypes.GameStart } },
      ],
    }).count()) {
      return joinGameResults.gameStarted;
    }
    const isGameStarted = !!GameLog.find({
      $and: [
        { gameId: { $eq: currGame._id } },
        { 'event.nameType': { $eq: eventTypes.GameStart } },
      ],
    }).count();
    const isPlayerReg = !!GameLog.find({
      $and: [
        { gameId: { $eq: currGame._id } },
        { 'event.nameType': { $eq: eventTypes.PlayerReg } },
        { 'event.playerId': { $eq: Meteor.userId() } },
      ],
    }).count();
    const addPlayerRegEvent = () => {
      GameLog.insert({ gameId: currGame._id, event: new PlayerReg({ playerId: Meteor.userId() }) });
    };
    !isGameStarted && !isPlayerReg && !currGame.isManager() && addPlayerRegEvent();
    return joinGameResults.regSucc;
  },
});
