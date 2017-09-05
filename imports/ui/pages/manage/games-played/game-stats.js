import React from 'react';
import PropTypes from 'prop-types';
import ManageNavbar from '/imports/ui/components/manage-navbar.js';
import PivotTable from '/imports/ui/components/pivot-table/pivot-table';

const HistoryPlayer = ({ game }) =>
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

HistoryPlayer.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

export default HistoryPlayer;
