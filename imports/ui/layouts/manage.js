import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ManageNavbar from '../components/manage-navbar.js';
import Loading from '../components/loading';

const ManageLayout = ({ children }) =>
  <div id="manage-layout">
    <ManageNavbar />
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1 col-xl-8-col-xs-offset-2">
          {children}
        </div>
      </div>
    </div>
  </div>;

const ManageLayoutContainer = ({ loading, children }) => {
  console.log(children);
  if (loading) return <Loading />;
  return <ManageLayout children={children} />;
};

export default createContainer(({ children }) => {
  const nameHandle = Meteor.subscribe('users.my-name');
  const loading = !nameHandle.ready();
  return {
    loading,
    children,
  };
}, ManageLayoutContainer);
