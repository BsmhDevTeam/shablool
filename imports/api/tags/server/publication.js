import { Meteor } from 'meteor/meteor';
import Tag from '../tags.js';

Meteor.publish('tags.all', function() {
  return Tag.find();
});
