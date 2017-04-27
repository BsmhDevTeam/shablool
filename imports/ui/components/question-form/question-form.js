import './question-form.html'

Template.create_quiz.events({
    'click .remove-question' (event, instance) {
        this.removeQuestion();
    },
});