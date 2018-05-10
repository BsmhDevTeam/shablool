import { Meteor } from 'meteor/meteor';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Factory } from 'meteor/dburles:factory';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { GameInit } from '../../games/games';
import './publication.js';

const asUser = (user) => {
  Meteor.userId.restore();
  sinon.stub(Meteor, 'userId', function() {
    return user; // User id
  });
};

describe('GameLog Publications', function() {
  beforeEach(function() {
    sinon.stub(Meteor, 'userId', function() {
      return 'owner'; // User id
    });
  });

  afterEach(function() {
    Meteor.userId.restore();
    resetDatabase();
  });

  describe('gamelogs.get-by-gameid', function() {
    it('should allow subscription to gamelogs I own', function(done) {
      const game = Factory.create('game', { _id: '123456' });
      const gameInitEvent = Factory.create('gamelog');
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('gamelogs.get-by-gameid', game.code, (collections) => {
        expect(collections.games.length).to.equal(2);
        done();
      });
    });
  });
});
