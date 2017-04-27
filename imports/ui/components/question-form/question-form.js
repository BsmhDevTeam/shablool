import './question-form.html'

Template.body.events({
    'click .add-question': function (e) {
      e.preventDefault();
      console.log("You pressed the button");
    }
  });