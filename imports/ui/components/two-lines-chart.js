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

const TwoLinesChart = ({ data, dataKeyA, dataKeyB, dataKeyX }) => {
  const CustomizedXAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#666" dy={16}>
        שאלה #{payload.value}
      </text>
    </g>
  );
  const CustomizedYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor="middle" fill="#666" dx={-16} dy={3}>
          {payload.value}
        </text>
      </g>
    );
  };
  const CustomizedTolltip = ({ payload, label, active }) => active
      ? <div className="panel panel-body">
        <div className="tooltip-area">
          <p>שאלה #{label}</p>
          <p style={{ color: payload[0].color }}>
              אני: {payload[0].payload.score || (payload[0].payload.time).toFixed(3)}
          </p>
          <p style={{ color: payload[1].color }}>
              ממוצע: {payload[1].payload.score || (payload[1].payload.time).toFixed(3)}
          </p>
        </div>
      </div>
      : null;

  return (
    <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 35, left: 0, bottom: 5 }}
      >
        <XAxis dataKey={dataKeyX} tick={<CustomizedXAxisTick />} />
        <YAxis tick={<CustomizedYAxisTick />} />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="bottom" />
        <Tooltip content={<CustomizedTolltip />} />
        <Line
          type="monotone"
          dataKey={dataKeyA}
          stroke="#8884d8"
          name="אני"
        />
        <Line
          type="monotone"
          dataKey={dataKeyB}
          stroke="#82ca9d"
          name="ממוצע"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TwoLinesChart;
