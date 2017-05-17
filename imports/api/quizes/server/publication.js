import Quize from "../quizes.js"
 
if (Meteor.isServer) {
	Meteor.publish('quiz-title', function() {
		return Quize.find({}, {fields:{title:true}});
	});

	Meteor.publish('quiz-by-id', function(idFromRoute) {
		return Quize.find({ _id : idFromRoute }, {});

	});	
}

