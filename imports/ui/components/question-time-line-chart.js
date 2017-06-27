import React from 'react';
import { Meteor } from 'meteor/meteor';
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

const QuestionTimeLineChart = ({ game }) => {
  const CustomizedXAxisTick = ({ x, y, stroke, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor="middle" fill="#666" dy={16}>
          question #{payload.value}
        </text>
      </g>
    );
  };
  const CustomizedYAxisTick = ({ x, y, stroke, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor="middle" fill="#666" dx={-16} dy={3}>
          {payload.value}
        </text>
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
      <LineChart
        data={game.getPlayerTimeAndAvarageTime(Meteor.userId())}
        margin={{ top: 5, right: 35, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="questionOrder" tick={<CustomizedXAxisTick />} />
        <YAxis tick={<CustomizedYAxisTick />} />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="bottom" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="playerTime"
          stroke="#8884d8"
          name="Me"
        />
        <Line
          type="monotone"
          dataKey="avarageTime"
          stroke="#82ca9d"
          name="Class"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default QuestionTimeLineChart;
