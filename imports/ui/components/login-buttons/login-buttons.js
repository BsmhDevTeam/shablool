import React from 'react';

const GithubLoginButton = ({ login }) =>
  <button className="btn btn-lg btn-warning btn-block" onClick={login}>
    Login
    <i className="fa fa-gitlab" aria-hidden="true" />
  </button>;

export default GithubLoginButton;
