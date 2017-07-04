import React from 'react';
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
  const CustomizedXAxisTick = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#666" dy={16}>
        שאלה #{payload.value}
      </text>
    </g>
  );
  const CustomizedYAxisTick = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#666" dx={-16} dy={3}>
        {Math.abs(payload.value)}{payload.value < 0 ? '-' : ''}
      </text>
    </g>
  );
  const CustomizedTolltip = ({ payload, label, active }) => active
      ? <div className="panel panel-body">
        <div className="tooltip-area">
          <p>שאלה #{label}</p>
          <p style={{ color: payload[0].color }}>
              ממוצע: {payload[0].payload.score || (payload[0].payload.time).toFixed(3)}
          </p>
        </div>
      </div>
      : null;

  return (
    <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
      <LineChart data={data} margin={{ top: 5, right: 35, left: 0, bottom: 5 }}>
        <XAxis dataKey={dataKeyX} tick={<CustomizedXAxisTick />} />
        <YAxis tick={<CustomizedYAxisTick />} />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="bottom" />
        <Tooltip content={<CustomizedTolltip />} />
        <Line
          type="monotone"
          dataKey={dataKeyY}
          stroke="#82ca9d"
          name="ממוצע"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OneLinesChart;
