import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import layouts
import '../../ui/layouts/game/game.js';
import '../../ui/layouts/manage/manage.js';

// Import pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/create-quiz/create-quiz.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('game_layout', { main: 'home' });
  },
});

FlowRouter.route('/createQuiz', {
  name: 'App.createQuiz',
  action() {
    BlazeLayout.render('manage_layout', { main: 'create_quiz' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('game_layout', { main: 'App_notFound' });
  },
};
