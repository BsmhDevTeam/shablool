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
import GameLog from '../gamelogs/gamelogs.js';

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
    getGamePage(gameLog) {
      // TODO: rewrite
      const playerEvents = gameLog.filter(e => e.playerId === Meteor.userId());
      const otherEvents = gameLog.filter(
        e => !(e.nameType === eventTypes.PlayerAnswer || e.nameType === eventTypes.PlayerReg),
      );
      return max(
        [max(playerEvents, e => e.createdAt), max(otherEvents, e => e.createdAt)],
        e => e.createdAt,
      );
    },
    isUserRegistered(gameLog) {
      const isUserExist = this.getPlayersId(gameLog).find(user => user === Meteor.userId());
      return !!isUserExist;
    },
    answersGroupCount(gameLog) {
      const lastQuestionId = this.lastQuestionToStartId(gameLog); // => qId
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
    getLastQuestionAnswers(gameLog) {
      return this.getPlayersAnswersByQuestion(this.lastQuestionToStartId(gameLog), gameLog);
    },
    getPlayersId(gameLog) {
      return gameLog.filter(e => e.nameType === eventTypes.PlayerReg)
      .map(e => e.playerId);
    },
    getPlayersCount(gameLog) {
      return gameLog.filter(e => e.nameType === eventTypes.PlayerReg).length;
    },
    scoreListById(gameLog) {
      const playersAnswers = gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer) // => [PlayerAnswer]
        .map(({ playerId, answerId, questionId, createdAt }) => ({
          playerId,
          timeDelta: calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId, gameLog)),
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
      const players = this.getPlayersId(gameLog);
      const scoreByUserId = players.map(pId => ({
        playerId: pId,
        userScore: finalScoreByUser[pId] || 0,
      })); // => [{playerId: name, userScore: score}, ...]
      return sortBy(scoreByUserId, 'userScore').reverse();
    },
    scoreListByName(gameLog) {
      const scoreListById = this.scoreListById(gameLog);
      const scoreByUserName = scoreListById.map(o => ({
        userName: Meteor.users.findOne(o.playerId).username,
        userScore: o.userScore,
      })); // => [{userName: name, userScore: score}, ...]
      return scoreByUserName;
    },
    getLeaders(gameLog) {
      const scoreByUserNamesSorted = first(this.scoreListByName(gameLog), 5);
      return scoreByUserNamesSorted; // => [{userName, score}, ...] - 5 elements
    },
    getScoreByUserId(pId, gameLog) {
      const uIdAndScore = this.scoreListById(gameLog).find(o => o.playerId === pId);
      return uIdAndScore.userScore;
    },
    getPlaceByUserId(pId, gameLog) {
      const place = this.scoreListById(gameLog).findIndex(o => o.playerId === pId);
      return place + 1;
    },
    getQuestionStartTime(qId, gameLog) {
      const questionStartEvent = gameLog
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
    lastQuestionToStartId(gameLog) {
      const questionLog = gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents = orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents.questionId;
      return qId;
    },
    lastQuestionToStart(gameLog) {
      const lastQuestionId = this.lastQuestionToStartId(gameLog);
      const lastQuestion = this.quiz.questions.find(q => q._id === lastQuestionId);
      return lastQuestion;
    },
    lastQuestionToEndId(gameLog) {
      const questionLog = gameLog.filter(e => e.nameType === eventTypes.QuestionEnd);
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents = orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents ? lastQuestionEvents.questionId : undefined;
      return qId;
    },
    lastQuestionToEnd(gameLog) {
      const lastQuestionId = this.lastQuestionToEndId(gameLog);
      const lastQuestion = this.quiz.questions.find(q => q._id === lastQuestionId);
      return lastQuestion;
    },
    getUsernameByUserID(uId) {
      const username = Meteor.users
        .find({ _id: uId }, { fields: { username: 1 } })
        .map(p => p.username);
      return username;
    },
    getPlayersName(gameLog) {
      const playersIds = this.getPlayersId(gameLog);
      const playersNames = Meteor.users
        .find({ _id: { $in: playersIds } }, { fields: { username: 1 } })
        .map(p => p.username);
      return playersNames;
    },
    getLastEvent(gameLog) {
      return last(gameLog);
    },
    getWinner(gameLog) {
      return first(this.getLeaders(gameLog));
    },
    isCurrentQuestionEnded(gameLog) {
      const isEnded = this.lastQuestionToStartId(gameLog) === this.lastQuestionToEndId(gameLog);
      return isEnded;
    },
    nextQuestionId(gameLog) {
      const lastQuestion = this.lastQuestionToEnd(gameLog);
      const lastQuestionOrder = lastQuestion.order;
      const nextQuestion = this.quiz.questions.find(q => q.order === lastQuestionOrder + 1);
      return this.isCurrentQuestionEnded(gameLog) ? nextQuestion._id : null;
    },
    isLastQuestion(gameLog) {
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      return lastQuestionOrder === this.lastQuestionToEnd(gameLog).order;
    },
    getQuestionTimeLeft(questionId, gameLog) {
      const questionStartEvents = gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      const questionStartEvent = questionStartEvents.filter(e => e.questionId === questionId);
      // Check if question already ended
      const questionEndEvents = gameLog.filter(e => e.nameType === eventTypes.QuestionEnd);
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
    getPlayerQuestionAndScore(pId, gameLog) {
      const playerAnswerEvents = gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.playerId === pId);
      const questionAndScore = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        score: calculateScore(
          calculateTimeDelta(
            e.createdAt,
            gameLog
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
    getPlayerQuestionAndTime(pId, gameLog) {
      const playerAnswerEvents = gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.playerId === pId);
      const questionAndTime = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        time:
          e.createdAt.getTime() / 1000 -
          gameLog
            .filter(qse => qse.nameType === eventTypes.QuestionStart)
            .find(qse => qse.questionId === e.questionId)
            .createdAt.getTime() / 1000,
      })); // [{questionOrder: o, time: t}, ...]
      return questionAndTime;
    },
    getAvarageScoreForQuestion(qId, gameLog) {
      const playerAnswerEvents = gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === qId);
      const scores = playerAnswerEvents.map(e =>
        calculateScore(
          calculateTimeDelta(
            e.createdAt,
            gameLog
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
    getAvarageQuestionAndScore(gameLog) {
      const playerAnswerEvents = gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
      const questionAndScore = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        score: this.getAvarageScoreForQuestion(e.questionId, gameLog),
      }));
      return questionAndScore; // [{questionOrder: o, score: s}, ...]
    },
    getAvarageTimeForQuestion(qId, gameLog) {
      const playerAnswerEvents = gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === qId);
      const questionStartTime = this.getQuestionStartTime(qId, gameLog) / 1000;
      const times = playerAnswerEvents.map(e => e.createdAt.getTime() / 1000 - questionStartTime);
      return avarage(times);
    },
    getAvarageQuestionAndTime(gameLog) {
      const playerAnswerEvents = gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
      const questionAndScore = playerAnswerEvents.map(e => ({
        questionOrder: this.getQuestionsOrder(e.questionId),
        time: this.getAvarageTimeForQuestion(e.questionId, gameLog),
      })); // [{questionOrder: o, time: t}, ...]
      return questionAndScore;
    },
    getMaxQuizOrder(gameLog) {
      const questionStartEvents = gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      return questionStartEvents.length;
    },
    getPlayerScoreAndAvarageScore(pId, gameLog) {
      const playerQuestionAndScore = this.getPlayerQuestionAndScore(pId, gameLog);
      const playerAndAvarageScore = playerQuestionAndScore.map(o => ({
        questionOrder: o.questionOrder,
        playerScore: o.score,
        avarageScore: this.getAvarageScoreForQuestion(
          this.quiz.questions.find(q => q.order === o.questionOrder)._id,
          gameLog,
        ),
      }));
      return playerAndAvarageScore;
    },
    getPlayerTimeAndAvarageTime(pId, gameLog) {
      const playerQuestionAndTime = this.getPlayerQuestionAndTime(pId, gameLog);
      const playerAndAvarageTime = playerQuestionAndTime.map(o => ({
        questionOrder: o.questionOrder,
        playerTime: o.time,
        avarageTime: this.getAvarageTimeForQuestion(
          this.quiz.questions.find(q => q.order === o.questionOrder)._id,
          gameLog,
        ),
      }));
      return playerAndAvarageTime;
    },
    getQuestionIdByOrder(order) {
      const question = this.quiz.questions.find(q => q.order === order);
      return question ? question._id : undefined;
    },
    getPlayersAnswersByQuestion(qId, gameLog) {
      const playersAnswerEvents = gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === qId);
      return playersAnswerEvents;
    },
    isAllPlayerAnsweredToQuestion(qId, gameLog) {
      return (size(this.getPlayersAnswersByQuestion(qId, gameLog)) === this.getPlayersCount());
    },
    getDataForPivotTable(gameLog) {
      const playerAnswerEvents = gameLog.filter(e => e.nameType === eventTypes.PlayerAnswer);
      const playerAnswers = this.isManager()
        ? playerAnswerEvents
        : playerAnswerEvents.filter(e => e.playerId === Meteor.userId());

      const data = playerAnswers.map(({ playerId, answerId, questionId, createdAt }) => ({
        משתמש: this.getUsernameByUserID(playerId),
        'מספר השאלה': this.quiz.questions.find(q => q._id === questionId).order,
        'זמן השאלה': this.quiz.questions.find(q => q._id === questionId).time,
        'מספר התשובה': this.quiz.questions.find(q => q._id === questionId).answers.find(a => a._id === answerId).order,
        'זמן התשובה': calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId, gameLog)),
        'נקודות תשובה': this.quiz.questions.find(q => q._id === questionId).answers.find(a => a._id === answerId).points,
        נקודות: calculateScore(calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId, gameLog)),
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
});
