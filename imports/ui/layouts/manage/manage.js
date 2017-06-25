import React from 'react';
import ManageNavbar from '../../components/manage-navbar.js';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Loading from '../../components/loading';

const ManageLayout = ({main}) => (
  <div id="manage">
    <ManageNavbar />
    <div className="container">
      {main}
    </div>
  </div>
);

const ManageLayoutContainer = ({ loading, main}) => {
  if (loading) return <Loading />;
  return <ManageLayout main={main} />;
};

export default createContainer(({ main }) => {
  const nameHandle = Meteor.subscribe('users.my-name');
  const loading = !nameHandle.ready();
  return {
    loading,
    main,
  };
}, ManageLayoutContainer);

