import { Meteor } from 'meteor/meteor';

Meteor.publish('users.names', () =>
  Meteor.users.find({}, { fields: { 'services.github.username': 1 } }),
);
