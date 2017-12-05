// games

export const eventTypes = {
  GameInit: 'GAME_INIT',
  PlayerReg: 'PLAYER_REG',
  GameStart: 'GAME_START',
  QuestionStart: 'QUESTION_START',
  PlayerAnswer: 'PLAYER_ANSWER',
  QuestionEnd: 'QUESTION_END',
  ShowLeaders: 'SHOW_LEADERS',
  GameEnd: 'GAME_END',
  GameClose: 'GAME_CLOSE',
};

export const joinGameResults = {
  alreadyRegistered: 'ALREADY_REGISTERED',
  isManager: 'IS_MANAGER',
  noGame: 'NO_GAME',
  regSucc: 'REG_SUCC',
  gameStarted: 'GAME_STARTED',
};

export const startGameResults = {
  alreadyStarted: 'ALREADY_STARTED',
  notOwner: 'NOT_OWNER',
  noPlayersReg: 'NO_PLAYERS_REG',
  startSucc: 'START_SUCC',
};

export const questionEndResults = {
  questionHasNotStarted: 'QUESTION_HAS_NOT_STARTED',
  alreadyEnded: 'ALREADY_ENDED',
  endSucc: 'END_SUCC',
};

export const playerAnswerResults = {
  playerHasNotRegistered: 'PLAYER_HAS_NOT_REGISTERED',
  questionHasNotStarted: 'QUESTION_HAS_NOT_STARTED',
  questionHasEnded: 'QUESTION_HAS_ENDED',
  alreadyAnswered: 'ALREADY_ANSWERED',
  isManager: 'IS_MANAGER',
  playerAnswerSucc: 'PLAYER_ANSWER_SUCC',
};

export const endGameResults = {
  alreadyEnded: 'ALREADY_ENDED',
  notOwner: 'NOT_OWNER',
  endSucc: 'END_SUCC',
};

export const closeGameResults = {
  alreadyClosed: 'ALREADY_CLOSED',
  notOwner: 'NOT_OWNER',
  closeSucc: 'CLOSE_SUCC',
};

// manage

export const managementTabs = {
  myQuizes: 'MY_QUIZES',
  gamesManaged: 'GAMES_MANAGED',
  gamesPlayed: 'GAMES_PLAYED',
};

export const noImage = 'NO_IMAGE';
