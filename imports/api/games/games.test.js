import { Meteor } from 'meteor/meteor';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { assert, expect } from 'chai';
import { first, sortBy } from 'underscore';
import { eventTypes } from '/imports/startup/both/constants';
import Game from './games.js';

const asUser = (user) => {
  Meteor.userId.restore();
  sinon.stub(Meteor, 'userId', function() {
    return user; // User id
  });
};

describe('Game Helpers', function() {
  beforeEach(function() {
    sinon.stub(Meteor, 'userId', function() {
      return 'owner'; // User id
    });
  });

  afterEach(function() {
    Meteor.userId.restore();
    resetDatabase();
  });

  describe('isManager', function() {
    it('should return true if the user is the game owner', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return false if the user is not the game owner', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('isUserRegistered', function() {
    it('should return true if the user has registered to the game', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return false if the user is not in the game', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('getPlayersId', function() {
    it('should return empty list if there are no users', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return a list of ids', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('getPlayersCount', function() {
    it('should return 0 if there are no users', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return the number of players', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('getQuestionsOrder', function() {
    it('should return the order of the question', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('didAllPlayersAnsweredQuestion', function() {
    it('should return true if all players answered the question', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return false if not all players answered the question', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('STUB', function() {
    it('should return empty list if there are no users', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return a list of ids', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });

  describe('STUB', function() {
    it('should return empty list if there are no users', function() {
      throw new Error('TODO: WRITE TEST');
    });

    it('should return a list of ids', function() {
      throw new Error('TODO: WRITE TEST');
    });
  });
});
