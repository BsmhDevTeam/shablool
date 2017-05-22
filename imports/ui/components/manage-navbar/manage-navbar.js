import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const ManageNavbar = () => {
  const search = (event) => {
    event.preventDefault();
    const query = event.target.query.value;
    FlowRouter.go('Manage.Search', { query });
  };
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
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
          <a href="/" className="navbar-brand">צהו"ל</a>
        </div>
        <div className="collapse navbar-collapse" id="manage-nav">
          <ul className="nav navbar-nav">
            <li className="manage-nav-li"><a href="/profile">פרופיל</a></li>
          </ul>
          <form
            className="js-search navbar-form navbar-left"
            role="search"
            onSubmit={search}
          >
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Search"
                name="query"
                type="text"
              />
            </div>
            <button type="submit" className="btn btn-default">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default ManageNavbar;
