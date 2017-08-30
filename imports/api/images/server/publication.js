import { Meteor } from 'meteor/meteor';
import Image from '../images.js';

Meteor.publish('images.all', function() {
  return Image.find().cursor;
});
