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

const QuestionScoreLineChart = ({ game }) => {
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
          {Math.abs(payload.value)}{payload.value < 0 ? '-' : ''}
        </text>
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
      <LineChart
        data={game.getPlayerScoreAndAvarageScore(Meteor.userId())}
        margin={{ top: 5, right: 35, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="questionOrder" tick={<CustomizedXAxisTick />} />
        <YAxis tick={<CustomizedYAxisTick />} />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="bottom" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="playerScore"
          stroke="#8884d8"
          name="Me"
        />
        <Line
          type="monotone"
          dataKey="avarageScore"
          stroke="#82ca9d"
          name="Class"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default QuestionScoreLineChart;
