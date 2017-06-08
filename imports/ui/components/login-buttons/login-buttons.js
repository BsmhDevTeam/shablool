import React from 'react';

const GithubLoginButton = ({ login }) =>
  <a className="btn btn-lg btn-warning btn-block" onClick={login}>
    Login
    <i className="fa fa-gitlab" aria-hidden="true" />
  </a>;

export default GithubLoginButton;
