// RevenuePieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MostProductOrder = () => {
    // Sample data for revenue by category
    const data = {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        datasets: [
            {
                label: 'Total : ',
                data: [12000, 15000, 18000, 10000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += `${context.raw.toLocaleString()}`;
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default MostProductOrder;
