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
        this.questionEnd(firstQuestion._id);
      };
      Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
      return true;
    },
    questionEnd(qId) {
      const questionEnd = new QuestionEnd({
        questionId: qId,
      });
      this.gameLog = this.gameLog.concat(questionEnd);
      this.save();
    },
    playerAnswer(uId, qId, aId) {
      const addingPlayerAnswerEvent = () => {
        const playerAnswerEvent = new PlayerAnswer({
          playerId: uId,
          questionId: qId,
          answerId: aId,
        });
        this.gameLog = this.gameLog.concat(playerAnswerEvent);
        this.save();
        return true;
      };
      const playerAnswerEventArray = this.gameLog.filter(
        e => e.nameType === this.getEventTypes().PlayerAnswer,
      );
      const playerAlreadyAnswer = playerAnswerEventArray.find(
        e => e.playerId === uId && e.questionId === qId,
      );
      const _ = !playerAlreadyAnswer && this.quiz.owner !== Meteor.userId()
        ? addingPlayerAnswerEvent()
        : false;
      return _;
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
        this.questionEnd(qId);
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
  },
});
