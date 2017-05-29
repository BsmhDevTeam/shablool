import React from 'react';
import ManageNavbar from '../../components/manage-navbar/manage-navbar.js';

const ManageLayout = ({ main }) => (
  <div id="manage">
    <ManageNavbar />
    <div className="container">
      {main}
    </div>
  </div>
);

export default ManageLayout;
