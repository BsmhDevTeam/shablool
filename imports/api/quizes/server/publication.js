
import { Meteor } from 'meteor/meteor';
import Quize from '../quizes.js';

if (Meteor.isServer) {
	Meteor.publish('quiz-title', function() {
		return Quize.find({}, {fields:{title:true}});
	});

Meteor.publish('quizes.myQuizes', function() {
  // TODO: filter only my quizes
  return Quize.find();
});

Meteor.publish('quizes.get', function(id) {
  return Quize.find(id);
});

Meteor.publish('quizes.search', function(query) {
    return Quize.find({
        $or: [
            {
                'title': {
                    '$regex': query,
                    $options: 'i'
                }
            }
        ]
    });
});
