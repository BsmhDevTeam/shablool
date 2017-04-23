import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

<<<<<<< HEAD
// Import needed templates
import '../../ui/layouts/game/game.js';
=======
// Import layouts
import '../../ui/layouts/body/body.js';

// Import pages
>>>>>>> 9514a3c14e5304956a1a5195b0a13d7011a1babb
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/createQuiz/createQuiz.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_game', { main: 'App_home' });
  },
});

FlowRouter.route('/createQuiz', {
  name: 'App.createQuiz',
  action() {
    BlazeLayout.render('App_body', { main: 'App_createQuiz' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
