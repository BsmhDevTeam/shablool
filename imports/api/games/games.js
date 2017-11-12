import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Factory } from 'meteor/dburles:factory';
import { eventTypes, noImage } from '/imports/startup/both/constants';
import {
  max,
  countBy,
  groupBy,
  sortBy,
  mapObject,
  pairs,
  pluck,
  first,
  last,
  size,
} from 'underscore';
import Quiz from '../quizes/quizes.js';

const calculateTimeDelta = (t1, t2) => {
  const datesDelta = t1.getTime() - t2.getTime();
  const secondsBetweenTime = datesDelta / 1000;
  const secondsBetweenDates = Math.abs(secondsBetweenTime);
  return secondsBetweenDates;
};

const calculateScore = (dt, s, qt) => {
  const portion = s > 0 ? qt - dt : dt;
  const percentage = portion / qt;
  const finalScore = percentage * s;
  return Math.ceil(finalScore);
};

const avarage = (arr) => {
  const sum = arr.reduce((a, b) => a + b, 0);
  return arr.length > 0 ? sum / arr.length : 0;
};

const generateCode = (n) => {
  const lowerBound = 10 ** (n - 1);
  const upperBound = 10 ** n;
  const randUpperBound = upperBound - lowerBound - 1;
  const rand = randUpperBound * Math.random();
  return Math.floor(rand + lowerBound);
};

export const GameInit = Class.create({
  name: eventTypes.GameInit,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameInit;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const PlayerReg = Class.create({
  name: eventTypes.PlayerReg,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.PlayerReg;
      },
    },
    playerId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const GameStart = Class.create({
  name: eventTypes.GameStart,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameStart;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const QuestionStart = Class.create({
  name: eventTypes.QuestionStart,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.QuestionStart;
      },
    },
    questionId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const PlayerAnswer = Class.create({
  name: eventTypes.PlayerAnswer,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.PlayerAnswer;
      },
    },
    playerId: {
      type: String,
    },
    answerId: {
      type: String,
    },
    questionId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const QuestionEnd = Class.create({
  name: eventTypes.QuestionEnd,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.QuestionEnd;
      },
    },
    questionId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const ShowLeaders = Class.create({
  name: eventTypes.ShowLeaders,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.ShowLeaders;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const GameEnd = Class.create({
  name: eventTypes.GameEnd,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameEnd;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const GameClose = Class.create({
  name: eventTypes.GameClose,
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameClose;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

const Game = Class.create({
  name: 'Game',
  collection: new Mongo.Collection('games'),
  fields: {
    quiz: Quiz,
    gameLog: {
      type: [Object],
      default() {
        return [new GameInit()];
      },
    },
    code: {
      type: String,
      default() {
        return generateCode(6).toString();
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
    lastUpdate: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },

  meteorMethods: {},

  helpers: {
    isManager() {
      return Meteor.userId() === this.quiz.owner;
    },
    getGamePage() {
      // TODO: rewrite
      const playerEvents = this.gameLog.filter(e => e.playerId === Meteor.userId());
      const otherEvents = this.gameLog.filter(
        e => !(e.nameType === eventTypes.PlayerAnswer || e.nameType === eventTypes.PlayerReg),
      );
      return max(
        [max(playerEvents, e => e.createdAt), max(otherEvents, e => e.createdAt)],
        e => e.createdAt,
      );
    },
    isUserRegistered() {
      const isUserExist = this.getPlayersId().find(user => user === Meteor.userId());
      return !!isUserExist;
    },
    answersGroupCount() {
      const lastQuestionId = this.lastQuestionToStartId(); // => qId
      const getAnswerOrder = id =>
        this.quiz.questions.find(q => q._id === lastQuestionId).answers.find(a => a._id === id)
          .order; // answer._id => answer.order
      const playersAnswerEvents = this.getLastQuestionAnswers() // => [PlayerAnswer, ...]
        .map(e => e.answerId) // => [answerId, ...]
        .map(getAnswerOrder) // => [answerOrder, ...]
        .concat([1, 2, 3, 4]); // => so there will always be 4 columns in the bar chart
      const questionsAnswersJson = countBy(playersAnswerEvents, o => o); // => {1: num, 2: num, ...}
      const questionAnswersArray = pairs(questionsAnswersJson).map(a => ({
        answerOrder: a[0],
        count: a[1],
      }));
      const answerOrderCount = questionAnswersArray.map(a => ({
        answerOrder: a.answerOrder,
        count: a.count - 1, // because we addere 1 to the count before
      }));
      return answerOrderCount;
    },
    getLastQuestionAnswerCount() {
      return this.getLastQuestionAnswers().length;
    },
    getLastQuestionAnswers() {
      return this.getPlayersAnswersByQuestion(this.lastQuestionToStartId());
    },
    getPlayersId() {
      return this.gameLog.filter(e => e.nameType === eventTypes.PlayerReg).map(e => e.playerId);
    },
    getPlayersCount() {
      return this.gameLog.filter(e => e.nameType === eventTypes.PlayerReg).length;
    },
    scoreListById() {
      const playersAnswers = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer) // => [PlayerAnswer]
        .map(({ playerId, answerId, questionId, createdAt }) => ({
          playerId,
          timeDelta: calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId)),
          answerScore: this.getAnswerScore(questionId, answerId),
          questionTime: this.getQuestionTime(questionId),
        })) // => [{playerId, timeDelta: t, answerScore: a, questionTime: q}]
        .map(({ playerId, timeDelta, answerScore, questionTime }) => ({
          playerId,
          userScore: calculateScore(timeDelta, answerScore, questionTime),
        })); // => [{playerId: id, userScore: score}, ...]
      const scoresByUser = mapObject(groupBy(playersAnswers, 'playerId'), a =>
        pluck(a, 'userScore'),
      ); // => {playerId: [score, score, score], ...}
      const finalScoreByUser = mapObject(scoresByUser, val => val.reduce((a, b) => a + b, 0));
      // => {playerId: finalScore, ...}
      const players = this.getPlayersId();
      const scoreByUserId = players.map(pId => ({
        playerId: pId,
        userScore: finalScoreByUser[pId] || 0,
      })); // => [{playerId: name, userScore: score}, ...]
      return sortBy(scoreByUserId, 'userScore').reverse();
    },
    scoreListByName() {
      const scoreListById = this.scoreListById();
      const scoreByUserName = scoreListById.map(o => ({
        userName: Meteor.users.findOne(o.playerId).username,
        userScore: o.userScore,
      })); // => [{userName: name, userScore: score}, ...]
      return scoreByUserName;
    },
    getLeaders() {
      const scoreByUserNamesSorted = first(this.scoreListByName(), 5);
      return scoreByUserNamesSorted; // => [{userName, score}, ...] - 5 elements
    },
    getScoreByUserId(pId) {
      const uIdAndScore = this.scoreListById().find(o => o.playerId === pId);
      return uIdAndScore.userScore;
    },
    getPlaceByUserId(pId) {
      const place = this.scoreListById().findIndex(o => o.playerId === pId);
      return place + 1;
    },
    getQuestionStartTime(qId) {
      const questionStartEvent = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionStart)
        .find(e => e.questionId === qId);
      const questionStartTime = questionStartEvent.createdAt;
      return questionStartTime;
    },
    getAnswerScore(qId, aId) {
      const question = this.quiz.questions.find(q => q._id === qId);
      const answer = question.answers.find(a => a._id === aId);
      const score = answer.points;
      return score;
    },
    getQuestionTime(qId) {
      const question = this.quiz.questions.find(q => q._id === qId);
      const time = question.time;
      return time;
    },
    lastQuestionToStartId() {
      const questionLog = this.gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents = orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents.questionId;
      return qId;
    },
    lastQuestionToStart() {
      const lastQuestionId = this.lastQuestionToStartId();
      const lastQuestion = this.quiz.questions.find(q => q._id === lastQuestionId);
      return lastQuestion;
    },
    lastQuestionToEndId() {
      const questionLog = this.gameLog.filter(e => e.nameType === eventTypes.QuestionEnd);
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents = orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents ? lastQuestionEvents.questionId : undefined;
      return qId;
    },
    lastQuestionToEnd() {
      const lastQuestionId = this.lastQuestionToEndId();
      const lastQuestion = this.quiz.questions.find(q => q._id === lastQuestionId);
      return lastQuestion;
    },
    getUsernameByUserID(uId) {
      const username = Meteor.users
        .find({ _id: uId }, { fields: { 'username': 1 } })
        .map(p => p.username);
      return username;
    },
    getPlayersName() {
      const playersIds = this.getPlayersId();
      const playersNames = Meteor.users
        .find({ _id: { $in: playersIds } }, { fields: { 'username': 1 } })
        .map(p => p.username);
      return playersNames;
    },
    getLastEvent() {
      return last(this.gameLog);
    },
    getWinner() {
      return first(this.getLeaders());
    },
    isCurrentQuestionEnded() {
      const isEnded = this.lastQuestionToStartId() === this.lastQuestionToEndId();
      return isEnded;
    },
    nextQuestionId() {
      const lastQuestion = this.lastQuestionToEnd();
      const lastQuestionOrder = lastQuestion.order;
      const nextQuestion = this.quiz.questions.find(q => q.order === lastQuestionOrder + 1);
      return this.isCurrentQuestionEnded() ? nextQuestion._id : null;
    },
    isLastQuestion() {
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      return lastQuestionOrder === this.lastQuestionToEnd().order;
    },
    getQuestionTimeLeft(questionId) {
      const questionStartEvents = this.gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      const questionStartEvent = questionStartEvents.filter(e => e.questionId === questionId);
      // Check if question already ended
      const questionEndEvents = this.gameLog.filter(e => e.nameType === eventTypes.QuestionEnd);
      const questionEndEvent = questionEndEvents.find(e => e.questionId === questionId);
      const isQuestionEnded = !!questionEndEvent;
      // calculate time passed
      const currentTime = isQuestionEnded ? questionEndEvent.createdAt : new Date();
      const timePassed = questionStartEvent.map(
        e => (currentTime.getTime() - e.createdAt.getTime()) / 1000,
      );
      const timeLeft = timePassed.map(
        t => this.quiz.questions.find(q => q._id === questionId).time - t,
      );
      return timeLeft < 0 ? 0 : Math.round(timeLeft);
    },
    getQuestionsOrder(qId) {
      const order = this.quiz.questions.find(q => q._id === qId).order;
      return order;
    },
    getPlayerQuestionAndScore(pId) {
      const playerAnswerEvents = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.playerId === pId);
      const questionAndScore = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        score: calculateScore(
          calculateTimeDelta(
            e.createdAt,
            this.gameLog
              .filter(qse => qse.nameType === eventTypes.QuestionStart)
              .find(qse => qse.questionId === e.questionId).createdAt,
          ),
          this.quiz.questions
            .find(q => q._id === e.questionId)
            .answers.find(a => a._id === e.answerId).points,
          this.getQuestionTime(e.questionId),
        ),
      })); // [{questionOrder: o, score: s}, ...]
      return questionAndScore;
    },
    getPlayerQuestionAndTime(pId) {
      const playerAnswerEvents = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.playerId === pId);
      const questionAndTime = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        time:
          e.createdAt.getTime() / 1000 -
          this.gameLog
            .filter(qse => qse.nameType === eventTypes.QuestionStart)
            .find(qse => qse.questionId === e.questionId)
            .createdAt.getTime() / 1000,
      })); // [{questionOrder: o, time: t}, ...]
      return questionAndTime;
    },
    getAvarageScoreForQuestion(qId) {
      const playerAnswerEvents = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === qId);
      const scores = playerAnswerEvents.map(e =>
        calculateScore(
          calculateTimeDelta(
            e.createdAt,
            this.gameLog
              .filter(qse => qse.nameType === eventTypes.QuestionStart)
              .find(qse => qse.questionId === e.questionId).createdAt,
          ),
          this.quiz.questions
            .find(q => q._id === e.questionId)
            .answers.find(a => a._id === e.answerId).points,
          this.getQuestionTime(e.questionId),
        ),
      );
      return avarage(scores);
    },
    getAvarageQuestionAndScore() {
      const playerAnswerEvents = this.gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
      const questionAndScore = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        score: this.getAvarageScoreForQuestion(e.questionId),
      }));
      return questionAndScore; // [{questionOrder: o, score: s}, ...]
    },
    getAvarageTimeForQuestion(qId) {
      const playerAnswerEvents = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === qId);
      const questionStartTime = this.getQuestionStartTime(qId) / 1000;
      const times = playerAnswerEvents.map(e => e.createdAt.getTime() / 1000 - questionStartTime);
      return avarage(times);
    },
    getAvarageQuestionAndTime() {
      const playerAnswerEvents = this.gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
      const questionAndScore = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        time: this.getAvarageTimeForQuestion(e.questionId),
      })); // [{questionOrder: o, time: t}, ...]
      return questionAndScore;
    },
    getMaxQuizOrder() {
      const questionStartEvents = this.gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      return questionStartEvents.length;
    },
    getPlayerScoreAndAvarageScore(pId) {
      const playerQuestionAndScore = this.getPlayerQuestionAndScore(pId);
      const playerAndAvarageScore = playerQuestionAndScore.map(o => ({
        questionOrder: o.questionOrder,
        playerScore: o.score,
        avarageScore: this.getAvarageScoreForQuestion(
          this.quiz.questions.find(q => q.order === o.questionOrder)._id,
        ),
      }));
      return playerAndAvarageScore;
    },
    getPlayerTimeAndAvarageTime(pId) {
      const playerQuestionAndTime = this.getPlayerQuestionAndTime(pId);
      const playerAndAvarageTime = playerQuestionAndTime.map(o => ({
        questionOrder: o.questionOrder,
        playerTime: o.time,
        avarageTime: this.getAvarageTimeForQuestion(
          this.quiz.questions.find(q => q.order === o.questionOrder)._id,
        ),
      }));
      return playerAndAvarageTime;
    },
    getQuestionIdByOrder(order) {
      const question = this.quiz.questions.find(q => q.order === order);
      return question ? question._id : undefined;
    },
    getPlayersAnswersByQuestion(qId) {
      const playersAnswerEvents = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === qId);
      return playersAnswerEvents;
    },
    isAllPlayerAnsweredToQuestion(qId) {
      return (size(this.getPlayersAnswersByQuestion(qId)) === this.getPlayersCount());
    },
    getDataForPivotTable() {
      const playerAnswerEvents = this.gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
      const playerAnswers = this.isManager()
        ? playerAnswerEvents
        : playerAnswerEvents.filter(e => e.playerId === Meteor.userId());

      const data = playerAnswers.map(({ playerId, answerId, questionId, createdAt }) => ({
        משתמש: this.getUsernameByUserID(playerId),
        'מספר השאלה': this.quiz.questions.find(q => q._id === questionId).order,
        'זמן השאלה': this.quiz.questions.find(q => q._id === questionId).time,
        'מספר התשובה': this.quiz.questions.find(q => q._id === questionId).answers.find(a => a._id === answerId).order,
        'זמן התשובה': calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId)),
        'נקודות תשובה': this.quiz.questions.find(q => q._id === questionId).answers.find(a => a._id === answerId).points,
        נקודות: calculateScore(calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId)),
               this.quiz.questions.find(q => q._id === questionId).answers.find(a => a._id === answerId).points,
               this.quiz.questions.find(q => q._id === questionId).time),
      }));
      return data;
    },
    getImagesId() {
      return this.quiz.questions.map(q => q.image).filter(e => e !== noImage);
    },
  },
});

export default Game;

Factory.define('game', Game, {
  quiz: () => Factory.create('quiz', { owner: 'owner' }),
  gameLog: () => [new GameInit()],
});
