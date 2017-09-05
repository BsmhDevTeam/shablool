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

const TwoLinesChart = ({ data, dataKeyA, dataKeyB, dataKeyX }) => {
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
        {payload.value}
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
              אני: {payload[0].payload.playerScore || payload[0].payload.playerTime.toFixed(3)}
          </p>
          <p style={{ color: payload[1].color }}>
              ממוצע: {payload[1].payload.playerScore || payload[1].payload.playerTime.toFixed(3)}
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
        <Line type="monotone" dataKey={dataKeyA} stroke="#8884d8" name="אני" />
        <Line type="monotone" dataKey={dataKeyB} stroke="#82ca9d" name="ממוצע" />
      </LineChart>
    </ResponsiveContainer>
  );
};

TwoLinesChart.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  dataKeyA: PropTypes.string.isRequired,
  dataKeyB: PropTypes.string.isRequired,
  dataKeyX: PropTypes.string.isRequired,
};

export default TwoLinesChart;
