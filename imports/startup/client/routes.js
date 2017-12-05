
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
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

const verifyLogin = () => {
  if (!Meteor.loggingIn() || !Meteor.userId()) {
    return false;
  }
  return true;
};

const router = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route
        path="/EditQuiz/:_id"
        render={(props) => (verifyLogin() ? (
          <ManageLayout><EditQuiz id={props.match.params._id} /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/CreateQuiz"
        render={() => <ManageLayout><CreateQuiz /></ManageLayout>}
      />
      <Route
        path="/Manage"
        render={() => <ManageLayout><Main /></ManageLayout>}
      />
      <Route
        path="/search/:query?"
        render={(props) => <ManageLayout><Search query={props.match.params.query} /></ManageLayout>}
      />
      <Route
        path="/ViewQuiz/:_id"
        render={(props) => <ManageLayout><ViewQuiz id={props.match.params._id} /></ManageLayout>}
      />
      <Route
        path="/manage/game/:code"
        render={(props) => <ManageLayout><HistoryRouter code={props.match.params.code} /></ManageLayout>}
      />
      <Route
        path="/Login"
        render={() => <LoginLayout><Login /></LoginLayout>}
      />
      <Route
        path="/LoginError"
        render={() => <LoginLayout><LoginError /></LoginLayout>}
      />
      <Route
        exact
        path="/"
        render={() => <GameLayout><Home /></GameLayout>}
      />
      <Route
        path="/game/:code"
        render={(props) => <GameLayout><GameRouter code={props.match.params.code} /></GameLayout>}
      />
      <Route
        path="*"
        render={() => <GameLayout><NotFound /></GameLayout>}
      />
    </Switch>
  </Router>
);

Meteor.startup(() => {
  render(router(), document.getElementById('app'));
});
