import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = ({ data, title }) => {
  const chartData = {
    labels: ['Used', 'Available'],
    datasets: [
      {
        data: data,
        backgroundColor: ['#ff9999', '#66b3ff'],
        hoverBackgroundColor: ['#ff6666', '#3399ff'],
      },
    ],
  };

  return (
    <div>
      <h3>{title}</h3>
      <Pie data={chartData} width={'210px'} />
    </div>
  );
};

export default PieChart;
