// RevenueChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartRevenues = () => {
    // Sample data for revenue, update as needed
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: [12000, 15000, 18000, 17000, 20000, 24000, 22000],
                backgroundColor: 'rgb(170, 80, 179)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue ($)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Months',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Sale Revenue',
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ChartRevenues;
