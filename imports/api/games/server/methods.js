import { Meteor } from 'meteor/meteor';
import { max, difference, first } from 'underscore';
import { check } from 'meteor/check';
import { eventTypes, joinGameResults, startGameResults } from '/imports/startup/both/constants';
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
  generateCode,
} from '../games';
import GameLog from '../../gamelogs/gamelogs';

Game.extend({
  meteorMethods: {
    initGame() {
      const getCode = () => {
        const code = generateCode(6).toString();
        const gamesId = Game.find({ code }).fetch().map(g => g._id);
        const gameInitEvents = GameLog.find({ gameId: { $in: gamesId }, 'event.nameType': eventTypes.GameInit }).count();
        const gameCloseEvents = GameLog.find({ gameId: { $in: gamesId }, 'event.nameType': eventTypes.GameClose }).count();
        return gameInitEvents === gameCloseEvents ? code : getCode();
      };
      const code = getCode();
      this.set('code', code);
      this.save();
      GameLog.insert({ gameId: this._id, event: new GameInit() });
      // Closing Game
      const closeGameToLog = () => this.closeGame();
      Meteor.setTimeout(closeGameToLog, 24 * 60 * 60 * 1000); // close game after 24H
      return this.code;
    },
    startGame() {
      // Starting game
      const startGameRslt = this.gameStart();
      const runFirstQuestion = () => {
        // Starting first question
        const firstQuestion = this.quiz.questions.find(q => q.order === 1);
        this.questionStart(firstQuestion._id);
        // Ending question
        const questionEndToLog = () => {
          this.questionEnd(firstQuestion._id);
        };
        Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
      };
      startGameRslt === startGameResults.startSucc ? runFirstQuestion() : null;
      return startGameRslt;
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
      return isAnyPlayerReg ? startGameResults.startSucc : startGameResults.noPlayersReg;
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
      const isOtherQuestionRunning = GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionStart } },
        ],
      }).count() === GameLog.find({
        $and: [
          { gameId: { $eq: this._id } },
          { 'event.nameType': { $eq: eventTypes.QuestionEnd } },
        ],
      }).count();
      const addQuestionStartEvent = () => {
        GameLog.insert({ gameId: this._id, event: new QuestionStart({ questionId: qId }) });
      };
      isGameAlreadyStarted && !isQuestionStart && isOtherQuestionRunning && this.isManager() && addQuestionStartEvent();
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
      const gameLog = GameLog.find({ gameId: this._id }).map(o => o.event);
      GameLog.insert({ gameId: this._id, event: new ShowLeaders({ questionId: this.lastQuestionToEnd(gameLog) }) });
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
    nextQuestion(gameLog) {
      // start question
      const qId = this.nextQuestionId(gameLog);
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
      const gameLog = GameLog.find({ gameId: this._id }).map(o => o.event);
      GameLog.insert({ gameId: this._id, event: new ShowLeaders({ questionId: this.lastQuestionToEnd(gameLog) }) });
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
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      const gameLog = GameLog.find({ gameId: this._id }).map(o => o.event);
      return lastQuestionOrder === this.lastQuestionToEnd(gameLog).order
        ? this.endGame()
        : this.nextQuestion(gameLog);
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

    const gamesId = Game.find({ code }).fetch().map(g => g._id);
    const gameInitEvents = GameLog.find({ gameId: { $in: gamesId }, 'event.nameType': eventTypes.GameInit }).map(gl => gl.gameId);
    const gameCloseEvents = GameLog.find({ gameId: { $in: gamesId }, 'event.nameType': eventTypes.GameClose }).map(gl => gl.gameId);
    const currGameId = first(difference(gameInitEvents, gameCloseEvents));
    const currGame = Game.findOne({ _id: currGameId });
    if (!currGame) {
      return joinGameResults.noGame;
    }
    const gameLog = GameLog.find({ gameId: currGame._id }).map(o => o.event);
    if (!Meteor.userId()) {
      return joinGameResults.noUserId;
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
