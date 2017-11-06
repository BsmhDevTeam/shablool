
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// Import layouts
import GameLayout from '/imports/ui/layouts/game.js';
import ManageLayout from '/imports/ui/layouts/manage.js';
import LoginLayout from '/imports/ui/layouts/login.js';

// Import pages
import Home from '/imports/ui/pages/game/home';
import Login from '/imports/ui/pages/login/login';
import LoginError from '/imports/ui/pages/login/login-error';
import CreateQuiz from '/imports/ui/pages/manage/my-quizes/create-quiz';
import EditQuiz from '/imports/ui/pages//manage/my-quizes/edit-quiz.js';
import Search from '/imports/ui/pages/search/search.js';
import ViewQuiz from '/imports/ui/pages/search/view-quiz';
import Main from '/imports/ui/pages/manage';
import GameRouter from '/imports/ui/pages/game/router';
import HistoryRouter from '/imports/ui/pages/manage/game-stats-router';
import NotFound from '/imports/ui/pages/not-found/not-found';

const browserHistory = createBrowserHistory();

const verifyLogin = ({ history }) => {
  if (Meteor.loggingIn() || Meteor.userId()) {
    return;
  }
  history.push('/Login');
};

const router = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route path="/CreateQuiz" render={() => <ManageLayout main={CreateQuiz} />} onEnter={verifyLogin} />
      <Route path="/Manage" render={() => <ManageLayout main={Main} />} onEnter={verifyLogin} />
      <Route path="/EditQuiz/:_id" render={() => <ManageLayout main={EditQuiz} />} onEnter={verifyLogin} />
      <Route path="/search/:query?" render={() => <ManageLayout main={Search} />} onEnter={verifyLogin} />
      <Route path="/ViewQuiz/:_id" render={() => <ManageLayout main={ViewQuiz} />} onEnter={verifyLogin} />
      <Route path="/manage/game/:code" render={() => <ManageLayout main={HistoryRouter} />} onEnter={verifyLogin} />
      <Route path="/Login" render={() => <LoginLayout main={Login} />} />
      <Route path="/LoginError" render={() => <LoginLayout main={LoginError} />} />
      <Route exact path="/" render={() => <GameLayout main={Home} />} onEnter={verifyLogin} />
      <Route path="/game/:code" render={() => <GameLayout main={GameRouter} />} onEnter={verifyLogin} />
      <Route path="*" render={() => <GameLayout main={NotFound} />} />
    </Switch>
  </Router>
);

Meteor.startup(() => {
  render(router(), document.getElementById('app'));
});
