import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Image from '../images.js';

Meteor.publish('images.all', function() {
  return Image.find().cursor;
});

Meteor.publish('images.by-id', function(id) {
  check(id, String);
  return Image.find({ _id: id });
});
