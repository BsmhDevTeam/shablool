import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class PivotTable extends React.Component {
  componentDidMount() {
    const { game } = this.props;
    console.log('renderers:', $.pivotUtilities);
    const renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.c3_renderers);

    const mps = game.getDataForPivotTable();

    $('#output').pivotUI(mps, {
      renderers,
      cols: ['Party'],
      rows: ['Province'],
      rendererName: 'Horizontal Stacked Bar Chart',
      rowOrder: 'value_z_to_a',
      colOrder: 'value_z_to_a',
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
    });
  }
  render() {
    return (
      <div className="row">
        <div id="output" />
      </div>
    );
  }
}

PivotTable.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};
