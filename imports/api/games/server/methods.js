import { Meteor } from 'meteor/meteor';
import { max } from 'underscore';
import { check } from 'meteor/check';
import { joinGameResults, eventTypes } from '/imports/startup/both/constants';
import Game, {
  PlayerReg,
  GameStart,
  QuestionStart,
  QuestionEnd,
  PlayerAnswer,
  ShowLeaders,
  GameEnd,
  GameClose,
} from '../games';

const endQuestion = (gId, qId) => {
  const game = Game.findOne(gId);
  game.questionEnd(qId);
};

const closeGame = (gId) => {
  const game = Game.findOne(gId);
  game.closeGame();
};

Game.extend({
  meteorMethods: {
    initGame() {
      return this.save();
    },
    playerRegister() {
      const registerPlayer = () => {
        const newReg = new PlayerReg({
          playerId: Meteor.userId(),
        });
        this.gameLog = this.gameLog.concat(newReg);
        this.save();
        return joinGameResults.regSucc;
      };
      return (
        (this.isUserRegistered() && joinGameResults.alreadyRegistered) ||
        (this.isManager() && joinGameResults.isManager) ||
        registerPlayer()
      );
    },
    startGame() {
      const playerRegister = this.gameLog.filter(e => e.nameType === eventTypes.PlayerReg);
      const isPlayerRegister = !!playerRegister.length;
      const start = () => {
        // Starting game
        const gameStart = new GameStart();
        this.gameLog = this.gameLog.concat(gameStart);
        this.save();
        // Starting first question
        const firstQuestion = this.quiz.questions.find(q => q.order === 1);
        const questionStarted = new QuestionStart({
          questionId: firstQuestion._id,
        });
        this.gameLog = this.gameLog.concat(questionStarted);
        this.save();
        // Ending question
        const questionEndToLog = () => {
          endQuestion(this._id, firstQuestion._id);
        };
        Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
        // Closing Game
        const closeGameToLog = () => closeGame(this._id);
        Meteor.setTimeout(closeGameToLog, 24 * 60 * 60 * 1000); // close game after 24H
        return true;
      };
      return isPlayerRegister && this.isManager() ? start() : false;
    },
    questionEnd(qId) {
      const addToGameLog = () => {
        const questionEnd = new QuestionEnd({
          questionId: qId,
        });
        this.gameLog = this.gameLog.concat(questionEnd);
        this.save();
        return true;
      };
      const questionEnd = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionEnd)
        .find(e => e.questionId === qId);
      return questionEnd ? false : addToGameLog();
    },
    skipQuestion(qId) {
      const questionEnd = new QuestionEnd({
        questionId: qId,
      });
      const showLeaders = new ShowLeaders();
      this.gameLog = this.gameLog.concat([questionEnd, showLeaders]);
      this.save();
      return true;
    },
    playerAnswer(qId, aId) {
      const isQuestionStarted = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionStart)
        .find(e => e.questionId === qId);

      const isQuestionClosed = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionEnd)
        .find(e => e.questionId === qId);

      const playerAlreadyAnswer = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .find(e => e.playerId === Meteor.userId() && e.questionId === qId);

      const playerRegistered = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerReg)
        .find(e => e.playerId === Meteor.userId());

      const addingPlayerAnswerEvent = () => {
        const playerAnswerEvent = new PlayerAnswer({
          playerId: Meteor.userId(),
          questionId: qId,
          answerId: aId,
        });
        this.gameLog = this.gameLog.concat(playerAnswerEvent);
        this.save();
        return this.isEveryoneAnswered(qId) && endQuestion(this._id, qId);
      };

      return (
        !playerRegistered ||
        !isQuestionStarted ||
        isQuestionClosed ||
        playerAlreadyAnswer ||
        this.isManager() ||
        addingPlayerAnswerEvent()
      );
    },
    nextQuestion() {
      // start question
      const qId = this.nextQuestionId();
      const questionStarted = new QuestionStart({
        questionId: qId,
      });
      this.gameLog = this.gameLog.concat(questionStarted);
      this.save();
      // end question
      const q = this.quiz.questions.find(ques => ques._id === qId);
      const questionEndToLog = () => {
        endQuestion(this._id, qId);
      };
      Meteor.setTimeout(questionEndToLog, q.time * 1000);
      return true;
    },
    showLeaders() {
      const showLeadersEvent = new ShowLeaders();
      this.gameLog = this.gameLog.concat(showLeadersEvent);
      this.save();
      return true;
    },
    endGame() {
      const addToGameLog = () => {
        const gameEnd = new GameEnd();
        this.gameLog = this.gameLog.concat(gameEnd);
        this.save();
        return true;
      };
      const gameEnd = this.gameLog.find(e => e.nameType === eventTypes.GameEnd);
      return gameEnd ? false : addToGameLog();
    },
    endGameOrNextQuestion() {
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      return lastQuestionOrder === this.lastQuestionToEnd().order
        ? this.endGame()
        : this.nextQuestion();
    },
    closeGame() {
      const addToGameLog = () => {
        const gameClose = new GameClose();
        this.gameLog = this.gameLog.concat(gameClose);
        this.save();
        return true;
      };
      const gameClose = this.gameLog.find(e => e.nameType === eventTypes.GameClose);
      return gameClose ? false : addToGameLog();
    },
  },
});

Meteor.methods({
  // Methods without instance:
  joinGame({ code }) {
    check(code, String);
    const game = Game.findOne({ code });
    return game ? game.playerRegister() : joinGameResults.noGame;
  },
});
