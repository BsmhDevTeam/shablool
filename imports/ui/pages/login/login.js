import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Login = () => {
  const login = () => {
    Meteor.loginWithGitlab(err => (err ? <Redirect to="/LoginError" /> : <Redirect to="/" />));
  };

  const isAlreadyLoggedIn = Meteor.loggingIn() || Meteor.userId();
  if (isAlreadyLoggedIn) {
    return (<Redirect to="/" />);
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

export default Login;
