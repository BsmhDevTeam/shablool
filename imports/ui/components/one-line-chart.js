import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
  Line,
} from 'recharts';

const OneLinesChart = ({ data, dataKeyX, dataKeyY }) => {
  const CustomizedXAxisTick = ({ x, y, payload }) =>
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#666" dy={16}>
        {payload.value}
      </text>
    </g>;
  CustomizedXAxisTick.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    payload: PropTypes.instanceOf(Object),
  };

  const CustomizedYAxisTick = ({ x, y, payload }) =>
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#666" dx={-16} dy={3}>
        {Math.abs(payload.value)}
        {payload.value < 0 ? '-' : ''}
      </text>
    </g>;
  CustomizedYAxisTick.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    payload: PropTypes.instanceOf(Object),
  };

  const CustomizedTolltip = ({ payload, label, active }) =>
    active
      ? <div className="panel panel-body">
        <div className="tooltip-area">
          <p>
              שאלה #{label}
          </p>
          <p style={{ color: payload[0].color }}>
              ממוצע: {payload[0].payload.score || payload[0].payload.time.toFixed(3)}
          </p>
        </div>
      </div>
      : null;

  CustomizedTolltip.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    active: PropTypes.bool,
    payload: PropTypes.instanceOf(Object),
  };

  return (
    <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
      <LineChart data={data} margin={{ top: 5, right: 35, left: 0, bottom: 5 }}>
        <XAxis dataKey={dataKeyX} tick={<CustomizedXAxisTick />} />
        <YAxis tick={<CustomizedYAxisTick />} />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="bottom" />
        <Tooltip content={<CustomizedTolltip />} />
        <Line type="monotone" dataKey={dataKeyY} stroke="#82ca9d" name="ממוצע" />
      </LineChart>
    </ResponsiveContainer>
  );
};

OneLinesChart.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  dataKeyX: PropTypes.string.isRequired,
  dataKeyY: PropTypes.string.isRequired,
};

export default OneLinesChart;
