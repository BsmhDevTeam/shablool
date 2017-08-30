import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import 'pivottable';
import 'c3';
import '/node_modules/pivottable/dist/c3_renderers.js';
import '/node_modules/pivottable/dist/pivot.he.js';

export default class PivotTable extends React.Component {
  componentDidMount() {
    const { game } = this.props;

    const mps = game.getDataForPivotTable();

    $('#output').pivotUI(mps, {
      renderers: $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.c3_renderers),
      cols: ['מספר השאלה'],
      rows: ['משתמש'],
      rendererName: 'גרף עמודות',
      aggregatorName: 'סכום',
      rowOrder: 'key_a_to_z',
      colOrder: 'key_a_to_z',
      rendererOptions: {
        c3: {
          data: {
            colors: {
              Liberal: '#dc3912',
              Conservative: '#3366cc',
              NDP: '#ff9900',
              Green: '#109618',
              'Bloc Quebecois': '#990099',
            },
          },
        },
      },
    }, false, 'he');
  }
  render() {
    return (
      <div className="row">
        <div id="pivot-table">
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.11/c3.min.css" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.11/c3.min.js" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" />
          <div id="output" />
        </div>
      </div>
    );
  }
}

PivotTable.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};
