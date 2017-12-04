import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withRouter } from 'react-router-dom';

const Login = ({ history }) => {
  const login = () => {
    Meteor.loginWithGitlab(err => (err ? history.push('/LoginError') : history.push('/')));
  };

  const isAlreadyLoggedIn = Meteor.loggingIn() || Meteor.userId();
  if (isAlreadyLoggedIn) {
    history.push('/');
  }

  return (
    <div id="login">
      <button className="btn btn-lg btn-warning btn-block" onClick={login}>
        <i className="fa fa-gitlab fa-2x pull-right" aria-hidden="true" />
        <span style={{ fontSize: 'large', paddingTop: '5px', verticalAlign: 'middle' }}>התחבר</span>
      </button>
    </div>
  );
};

export default withRouter(Login);
