import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './cahrtstyle.css';  // Import the custom CSS file

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentMethodChart = ({ data }) => {
  // Process the data to sum up the total for each payment method
  const khqrTotal = data.reduce((sum, item) => sum + item.paymentMethods.KHQR, 0);
  const creditCardTotal = data.reduce((sum, item) => sum + item.paymentMethods["Credit Card"], 0);
  const cashTotal = data.reduce((sum, item) => sum + item.paymentMethods.Cash, 0);

  const chartData = {
    labels: ['KHQR', 'Credit Card', 'Cash'],
    datasets: [
      {
        data: [khqrTotal, creditCardTotal, cashTotal],
        backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Payment Method Usage',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} USD`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default PaymentMethodChart;
