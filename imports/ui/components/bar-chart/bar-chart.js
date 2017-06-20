import React from 'react';
import { BarChart, XAxis, Bar } from 'recharts';

const AnswerBar = ({ game }) => {
  const data = game.answersGroupCount();
  return (
    <BarChart width={730} height={250} data={data}>
      <XAxis dataKey="answerOrder" />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

const glyphIconsJson = {
  0: '\f004',
  1: '\f111',
  2: '\f0c8',
  3: '\f005',
};

const colorsJson = {
  0: '#d9534f',
  1: '#5bc0de',
  2: '#f0ad4e',
  3: '#5cb85c',
};

export default AnswerBar;
