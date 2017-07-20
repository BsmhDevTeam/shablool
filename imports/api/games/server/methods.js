import { Meteor } from 'meteor/meteor';
import { max } from 'underscore';
import Game, {
  PlayerReg,
  GameStarted,
  QuestionStart,
  QuestionEnd,
  PlayerAnswer,
  ShowLeaders,
  GameEnd,
  GameClose,
  eventTypes,
} from '../games';

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
        return true;
      };
      return !this.isUserRegistered() && !this.amIManager() && registerPlayer();
    },
    startGame() {
      const playerRegister = this.gameLog.filter(e => e.nameType === eventTypes.PlayerReg);
      const isPlayerRegister = !!playerRegister.length;
      const start = () => {
        // Starting game
        const gameStarted = new GameStarted();
        this.gameLog = this.gameLog.concat(gameStarted);
        this.save();
        // Starting first question
        const firstQuestion = this.quiz.questions.find(q => q.order === 1);
        const questionStarted = new QuestionStart({
          questionId: firstQuestion._id,
        });
        this.gameLog = this.gameLog.concat(questionStarted);
        this.save();
        // Ending question
        const questionEndToLog = () => (
            this.isQuestionEndAlready(firstQuestion._id) ||
            this.questionEnd(firstQuestion._id)
          );
        Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
        return true;
      };
      return isPlayerRegister ? start() : false;
    },
    questionEnd(qId) {
      const questionEnd = new QuestionEnd({
        questionId: qId,
      });
      this.gameLog = this.gameLog.concat(questionEnd);
      this.save();
      return true;
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
    playerAnswer(uId, qId, aId) {
      const isQuestionStarted = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionStart)
        .find(e => e.questionId === qId);

      const isQuestionClosed = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionEnd)
        .find(e => e.questionId === qId);

      const playerAlreadyAnswer = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .find(e => e.playerId === uId && e.questionId === qId);

      const playerRegistered = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerReg)
        .find(e => e.playerId === uId);

      const isGameManager = this.quiz.owner === Meteor.userId();

      const addingPlayerAnswerEvent = () => {
        const playerAnswerEvent = new PlayerAnswer({
          playerId: uId,
          questionId: qId,
          answerId: aId,
        });
        this.gameLog = this.gameLog.concat(playerAnswerEvent);
        this.save();
        return this.isEveryoneAnswered(qId) && this.questionEnd(qId);
      };

      return (
        !playerRegistered ||
        !isQuestionStarted ||
        isQuestionClosed ||
        playerAlreadyAnswer ||
        isGameManager ||
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
      const questionEndToLog = () =>
        this.isQuestionEndAlready(qId) || this.questionEnd(qId);
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
      const gameEnd = new GameEnd();
      this.gameLog = this.gameLog.concat(gameEnd);
      this.save();
    },
    endGameOrNextQuestion() {
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      return lastQuestionOrder === this.lastQuestionToEnd().order
        ? this.endGame()
        : this.nextQuestion();
    },
    closeGame() {
      const gameClose = new GameClose();
      this.gameLog = this.gameLog.concat(gameClose);
      this.save();
    },
    isQuestionEndAlready(qId) { // need to be in methods so it will be updated
      const questionEnd = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionEnd)
        .find(e => e.questionId === qId);
      return !!questionEnd;
    },
  },
});
