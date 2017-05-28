import React from 'react';
import ManageNavbar from '../../components/manage-navbar/manage-navbar.js';


const ManageLayout = props => (
  <div id="manage">
    <ManageNavbar />
    <div className="container">
      {props.main}
    </div>
  </div>
);

export default ManageLayout;
