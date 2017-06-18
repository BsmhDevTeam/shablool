import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

// Import layouts
import GameLayout from '../../ui/layouts/game/game.js';
import ManageLayout from '../../ui/layouts/manage/manage.js';

// Import pages
import Home from '../../ui/pages/home/home';
import Login from '../../ui/pages/login/login';
import LoginError from '../../ui/pages/login-error/login-error';
import Instructions from '../../ui/pages/instructions/instructions';
import GameLobby from '../../ui/pages/game-lobby/game-lobby';
import CreateQuiz from '../../ui/pages/create-quiz/create-quiz';
import EditQuiz from '../../ui/pages/edit-quiz/edit-quiz.js';
import Search from '../../ui/pages/search/search.js';
import ViewQuiz from '../../ui/pages/view-quiz/view-quiz';
import Management from '../../ui/pages/management/management.js';
import NotFound from '../../ui/pages/not-found/not-found';
import GameManager from '../../ui/pages/game/game';


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
  name: 'Manage.Game',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(GameLayout, { main: <GameManager code={params.code} /> });
  },
});

FlowRouter.route('/GameLobby', {
  name: 'Game.GameLobby',
  triggersEnter: [verifyLogin],
  action() {
    mount(GameLayout, { main: <GameLobby /> });
  },
});

FlowRouter.route('/Instructions', {
  name: 'Game.Instructions',
  triggersEnter: [verifyLogin],
  action() {
    mount(GameLayout, { main: <Instructions /> });
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
    mount(ManageLayout, { main: <Management /> });
  },
});

FlowRouter.route('/EditQuiz/:_id', {
  name: 'Menage.EditQuiz',
  triggersEnter: [verifyLogin],
  action(params) {
    mount(ManageLayout, { main: <EditQuiz id={params._id} /> });
  },
});

FlowRouter.route('/search/:query', {
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
