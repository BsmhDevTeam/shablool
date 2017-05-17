import './menagement-page.html';

import Quizes from '../../../api/quizes/quizes';

Template.menagementPage.onCreated( function() {
  Template.instance().subscribe('quiz-title');
});

//const names = ["תכנות בסיסי","תכנות מתקדם חרדים", "סייבר סייבר סייביר"];

Template.menagementPage.helpers({
  getQuizes() {
  	return Quizes.find();
 }
});