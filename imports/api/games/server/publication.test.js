import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import uuidV4 from 'uuid/v4';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import Quiz, { Question, Answer } from '/imports/api/quizes/quizes.js';
import Game, { GameInit, GameClose, PlayerReg } from '../games.js';
import './publication.js';

describe('games publication', function() {
  beforeEach(function() {
    resetDatabase();
    new Game({
      code: 'game1',
      quiz: new Quiz({
        title: 'title1',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag1'],
        owner: 'me',
        private: true,
      }),
      gameLog: [new GameInit()],
    }).save();
    new Game({
      code: 'game2',
      quiz: new Quiz({
        title: 'title2',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag2'],
        owner: 'me',
        private: false,
      }),
      gameLog: [new GameInit(), new GameClose()],
    }).save();
    new Game({
      code: 'game3',
      quiz: new Quiz({
        title: 'title2',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag2'],
        owner: 'owner',
        private: true,
      }),
      gameLog: [new GameInit(), new PlayerReg({ playerId: 'me' }), new GameClose()],
    }).save();
    new Game({
      code: 'game4',
      quiz: new Quiz({
        title: 'title3',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag3'],
        owner: 'owner',
        private: false,
      }),
      gameLog: [new GameInit()],
    }).save();
  });

  describe('games.get-by-code', function() {
    it('send my game by code', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('games.get-by-code', 'game1', (collections) => {
        assert.equal(collections.games.length, 1);
        done();
      });
    });
    it('send other user public game by code', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('games.get-by-code', 'game4', (collections) => {
        assert.equal(collections.games.length, 1);
        done();
      });
    });
    it('send other user private game by code', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('games.get-by-code', 'game3', (collections) => {
        assert.equal(collections.games.length, 1);
        done();
      });
    });
  });

  describe('games.games-managed', function() {
    it('get all games that I manage them and they closed', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('games.games-managed', (collections) => {
        assert.equal(collections.games.length, 1);
        done();
      });
    });
  });

  describe('games.games-played', function() {
    it('get all games that I played and they closed', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('games.games-played', (collections) => {
        assert.equal(collections.games.length, 1);
        done();
      });
    });
  });
});
