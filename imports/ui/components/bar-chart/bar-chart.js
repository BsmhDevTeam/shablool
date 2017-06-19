import React from 'react';
import { Bar } from 'react-chartjs';

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

const BarChart = ({ game }) => {
  const answers = game.answersGroupCount();
  const orders = Object.keys(answers);
  const options = {
    // Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: false,
    // Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: false,
    // Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: false,
  };
  const getData = (order, count) => {
    const data = {
      labels: [glyphIconsJson[order]],
      datasets: [{
        fillColor: colorsJson[order],
        data: [count],
      }],
    };
    return data;
  };
  const barsChart = orders.map(o => <Bar data={getData(o, answers[o])} options={options} />);
  return barsChart;
};

export default BarChart;
