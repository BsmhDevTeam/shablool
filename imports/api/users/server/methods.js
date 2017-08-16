import { Meteor } from 'meteor/meteor';

Meteor.users.deny({
  update() {
    return true;
  },
});
