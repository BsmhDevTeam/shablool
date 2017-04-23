import './create-quiz.html';
import '../../components/question-form/question-form.js';

Template.create_quiz.events({
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
