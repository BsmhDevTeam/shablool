import './createQuiz.html';
import '../../components/question-form/question-form.js';

Template.App_createQuiz.events({
  'click .save-quiz'(event, instance) {
    event.preventDefault();
    forms = instance.$('.question-form');
    
    objs = forms.map((i, form) => {
        return {
            q: form.question.value,
            as: [form.answer1.value, form.answer2.value, form.answer3.value, form.answer4.value]
        }
    });
  },
});
