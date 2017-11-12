import { Meteor } from 'meteor/meteor';

Meteor.publish('users.names', function() {
  return Meteor.users.find({}, { fields: { 'username': 1 } });
});

Meteor.publish('users.my-name', function() {
  return Meteor.users.find({ _id: this.userId }, { fields: { 'username': 1 } });
});
