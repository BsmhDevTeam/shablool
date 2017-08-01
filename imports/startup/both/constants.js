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

export const joinGameResult = {
  alreadyRegistered: 'ALREADY_REGISTERED',
  isManager: 'IS_MANAGER',
  noGame: 'NO_GAME',
  regSucc: 'REG_SUCC',
};

export const startGameResult = {
  alreadyStarted: 'ALREADY_STARTED',
  notOwner: 'NOT_OWNER',
  noPlayersReg: 'NO_PLAYERS_REG',
  startSucc: 'START_SUCC',
};
