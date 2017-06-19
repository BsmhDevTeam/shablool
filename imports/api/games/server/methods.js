import { Meteor } from 'meteor/meteor';
import Game, { PlayerReg, GameStarted, QuestionStart, QuestionEnd, PlayerAnswer } from '../games';

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
      return !this.isUserRegistered() && registerPlayer();
    },
    startGame() {
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
      const questionEndToLog = () => {
        const questionEnd = new QuestionEnd({
          questionId: firstQuestion._id,
        });
        this.gameLog = this.gameLog.concat(questionEnd);
        this.save();
      };
      Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
      return true;
    },
    playerAnswer(uId, qId, aId) {
      const playerAnswerEvent = new PlayerAnswer({
        userId: uId,
        questionId: qId,
        answerId: aId,
      });
      this.gameLog = this.gameLog.concat(playerAnswerEvent);
      this.save();
      return true;
    },
    nextQuestion() {
      const qId = this.nextQuestionId();
      const questionStarted = new QuestionStart({
        questionId: qId,
      });
      const questionEnd = new QuestionEnd({
        questionId: qId,
      });
      const q = this.quiz.questions.find(ques => ques._id === qId);
      const questionEndToLog = () => {
        this.gameLog = this.gameLog.concat(questionEnd);
        this.save();
      };
      this.gameLog = this.gameLog.concat(questionStarted);
      this.save();
      setTimeout(questionEndToLog, q.time);
      return true;
    },
  },
});
