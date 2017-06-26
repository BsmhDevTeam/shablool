import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

const QuestionScoreLineChart = ({ game }) => {
  return (
    <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
      <LineChart data={game.getPlayerScoreAndAvarageScore(Meteor.userId())}>
        <XAxis dataKey="questionOrder" name="question" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="playerScore" stroke="#8884d8" />
        <Line type="monotone" dataKey="avarageScore" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default QuestionScoreLineChart;
