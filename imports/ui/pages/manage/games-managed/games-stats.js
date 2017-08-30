import React from 'react';
import PropTypes from 'prop-types';
import ManageNavbar from '/imports/ui/components/manage-navbar.js';
import PivotTable from '/imports/ui/components/pivot-table/pivot-table';

const HistoryManager = ({ game }) =>
  <div id="history">
    <div className="row">
      <ManageNavbar />
    </div>
    <div className="row">
      <div className="chart">
        <PivotTable game={game} />
      </div>
    </div>
  </div>;

HistoryManager.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

export default HistoryManager;
