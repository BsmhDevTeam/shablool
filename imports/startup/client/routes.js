import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

// Import layouts
import GameLayout from '/imports/ui/layouts/game.js';
import ManageLayout from '/imports/ui/layouts/manage.js';
import LoginLayout from '/imports/ui/layouts/login.js';

// Import pages
import Home from '/imports/ui/pages/game/home';
import Login from '/imports/ui/pages/login/login';
import Register from '/imports/ui/pages/login/register';
import LoginError from '/imports/ui/pages/login/login-error';
import CreateQuiz from '/imports/ui/pages/manage/my-quizes/create-quiz';
import EditQuiz from '/imports/ui/pages//manage/my-quizes/edit-quiz.js';
import Search from '/imports/ui/pages/search/search.js';
import ViewQuiz from '/imports/ui/pages/search/view-quiz';
import Main from '/imports/ui/pages/manage';
import GameRouter from '/imports/ui/pages/game/router';
import HistoryRouter from '/imports/ui/pages/manage/game-stats-router';
import NotFound from '/imports/ui/pages/not-found/not-found';

const verifyLogin = () => {
  if (Meteor.loggingIn() || Meteor.userId()) {
    return;
  }
  FlowRouter.go('/Login');
};

const verifyNotLogin = () => {
    if (Meteor.loggingIn() || Meteor.userId()) {
        FlowRouter.go('/');
    }
};

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Home',
  triggersEnter: [verifyLogin],
  action() {
    mount(GameLayout, { main: <Home /> });
  },
});

FlowRouter.route('/game/:code', {
  name: 'Game.Play',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(GameLayout, { main: <GameRouter code={params.code} /> });
  },
});

FlowRouter.route('/manage/game/:code', {
  name: 'Manage.Game',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(GameLayout, { main: <HistoryRouter code={params.code} /> });
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
  triggersEnter: [verifyNotLogin],
  action() {
    mount(LoginLayout, { main: <Login /> });
  },
});

FlowRouter.route('/Register', {
  name: 'Game.Register',
  triggersEnter: [verifyNotLogin],
  action() {
    mount(LoginLayout, { main: <Register /> });
  },
});

FlowRouter.route('/LoginError', {
  name: 'Game.LoginError',
  action() {
    mount(LoginLayout, { main: <LoginError /> });
  },
});

FlowRouter.notFound = {
  action() {
    mount(GameLayout, { main: <NotFound /> });
  },
};
