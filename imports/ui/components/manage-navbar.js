import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default () => {
  const search = (e) => {
    e.preventDefault();
    const query = e.target.query.value;
    FlowRouter.go('Manage.Search', { query });
  };
  return (
    <nav className="navbar navbar-default navbar-fixed-top manage-navbar">
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#manage-nav"
            aria-expanded="false"
          >
            <span className="sr-only" />
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <a href="/" className="navbar-brand navbar-link-element"><img className="small-logo" src="/img/SmallLogoWhite.svg" /></a>
        </div>
        <div className="collapse navbar-collapse" id="manage-nav">
          <form
            className="js-search navbar-form navbar-right"
            role="search"
            onSubmit={search}
          >
            <div className="form-group">
              <input
                className="form-control"
                placeholder="חפש שאלון"
                name="query"
                type="text"
              />
            </div>
            <button type="submit" className="btn btn-default">
              <span className="glyphicon glyphicon-search" />
            </button>
          </form>
          <ul className="nav navbar-nav navbar-left">
            <li className="manage-nav-li">
              <a href="/Manage" className="navbar-link-element">
                <span>ברוך הבא, {Meteor.user().services.github.username} </span>
                <span className="glyphicon glyphicon-user" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
