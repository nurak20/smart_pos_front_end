import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ data }) => {
  // Summarize data by product
  const revenueByProduct = data.reduce((acc, curr) => {
    if (!acc[curr.productName]) {
      acc[curr.productName] = curr.revenues;
    } else {
      acc[curr.productName] += curr.revenues;
    }
    return acc;
  }, {});

  // Data for the chart
  const chartData = {
    labels: Object.keys(revenueByProduct),
    datasets: [
      {
        label: "Total Revenues",
        data: Object.values(revenueByProduct),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Revenues by Product",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SalesChart;
