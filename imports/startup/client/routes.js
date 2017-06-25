import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

// Import layouts
import GameLayout from '../../ui/layouts/game/game.js';
import ManageLayout from '../../ui/layouts/manage/manage.js';

// Import pages
import Home from '../../ui/pages/game-shared/home';
import Login from '../../ui/pages/login/login';
import LoginError from '../../ui/pages/login/login-error';
import CreateQuiz from '../../ui/pages/quiz-management/create-quiz';
import EditQuiz from '../../ui/pages/quiz-management/edit-quiz.js';
import Search from '../../ui/pages/quiz-management/search.js';
import ViewQuiz from '../../ui/pages/quiz-management/view-quiz';
import Main from '../../ui/pages/quiz-management/main.js';
import GameRouter from '../../ui/pages/game-shared/game-router';
import NotFound from '../../ui/pages/not-found/not-found';


const verifyLogin = () => {
  if (Meteor.loggingIn() || Meteor.userId()) {
    return;
  }
  FlowRouter.go('/Login');
};


// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Game.Home',
  triggersEnter: [verifyLogin],
  action() {
    mount(GameLayout, { main: <Home /> });
  },
});

FlowRouter.route('/Game/:code', {
  name: 'Game.Main',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(GameLayout, { main: <GameRouter code={params.code} /> });
  },
});

FlowRouter.route('/CreateQuiz', {
  name: 'Manage.CreateQuiz',
  triggersEnter: [verifyLogin],
  action() {
    mount(ManageLayout, { main: <CreateQuiz /> });
  },
});

FlowRouter.route('/Manage', {
  name: 'Manage.Home',
  triggersEnter: [verifyLogin],
  action() {
    mount(ManageLayout, { main: <Main /> });
  },
});

FlowRouter.route('/EditQuiz/:_id', {
  name: 'Menage.EditQuiz',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(ManageLayout, { main: <EditQuiz id={params._id} /> });
  },
});

FlowRouter.route('/search/:query?', {
  name: 'Manage.Search',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(ManageLayout, { main: <Search query={params.query} /> });
  },
});

FlowRouter.route('/ViewQuiz/:_id', {
  name: 'Manage.ViewQuiz',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(ManageLayout, { main: <ViewQuiz id={params._id} /> });
  },
});

FlowRouter.route('/Login', {
  name: 'Game.Login',
  action() {
    mount(GameLayout, { main: <Login /> });
  },
});

FlowRouter.route('/LoginError', {
  name: 'Game.LoginError',
  action() {
    mount(GameLayout, { main: <LoginError /> });
  },
});

FlowRouter.notFound = {
  action() {
    mount(GameLayout, { main: <NotFound /> });
  },
};
