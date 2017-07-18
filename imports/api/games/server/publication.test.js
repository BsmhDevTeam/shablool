import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publication.js';
import Game, { GameInit, eventTypes, QuestionEnd, GameClose, PlayerReg } from '../games.js';
import Quiz from '../../quizes/quizes.js';

describe('games publication', function () {
    beforeEach(function () {
        Game.remove({});
        new Game({
            code: 'game1',
            quiz: new Quiz({
                title: 'title1',
                questions: [],
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
                questions: [],
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
                questions: [],
                tags: ['tag2'],
                owner: 'owner',
                private: true,
            }),
            gameLog: [new GameInit(), new PlayerReg({ playerId:'me' }), new GameClose()],
        }).save();
        new Game({
            code: 'game4',
            quiz: new Quiz({
                title: 'title3',
                questions: [],
                tags: ['tag3'],
                owner: 'owner',
                private: false,
            }),
            gameLog: [new GameInit()],
        }).save();
    });


    describe('games.get-by-code', function () {
        it('send my game by code', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('games.get-by-code', 'game1', (collections) => {
                assert.equal(collections.games.length, 1);
                done();
            });
        });
        it('send other user public game by code', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('games.get-by-code', 'game4', (collections) => {
                assert.equal(collections.games.length, 1);
                done();
            });
        });
        it('send other user private game by code', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('games.get-by-code', 'game3', (collections) => {
                assert.equal(collections.games.length, 1);
                done();
            });
        });
    });

    describe('games.games-managed', function () {
        it('get all games that I manage them and they closed', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('games.games-managed', (collections) => {
                assert.equal(collections.games.length, 1);
                done();
            });
        });
    });

    describe('games.games-played', function () {
        it('get all games that I played and they closed', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('games.games-played', (collections) => {
                assert.equal(collections.games.length, 1);
                done();
            });
        });
    });

    describe('games.open', function () {
        it('get all open games', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('games.open', (collections) => {
                assert.equal(collections.games.length, 2);
                done();
            });
        });
    });
});
