import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IncomeByBranches } from '../../../../api/Reporting';
import { userObject } from '../../../../api/AppConfig';
import Chart from 'chart.js/auto';

const IncomeChartByBranches = ({ id }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        IncomeByBranches(id).then((response) => {
            const fetchedData = response.data;

            const labels = fetchedData.map((item) => item.date);
            const totalRevenue = fetchedData.map((item) => item.totalRevenue);
            const totalExpenses = fetchedData.map((item) => item.totalExpenses);
            const income = fetchedData.map((item) => item.income);

            // Gradients using RGB colors
            const gradientRevenue = (ctx) => {
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(136, 132, 216, 1)');
                gradient.addColorStop(1, 'rgba(136, 132, 216, 0.5)');
                return gradient;
            };

            const gradientExpenses = (ctx) => {
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(130, 202, 157, 1)');
                gradient.addColorStop(1, 'rgba(130, 202, 157, 0.5)');
                return gradient;
            };

            const gradientIncome = (ctx) => {
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(255, 99, 71, 1)');
                gradient.addColorStop(1, 'rgba(255, 99, 71, 0.5)');
                return gradient;
            };

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Total Revenue',
                        data: totalRevenue,
                        backgroundColor: (ctx) => gradientRevenue(ctx.chart.ctx),
                        borderRadius: 10,
                    },
                    {
                        label: 'Total Expenses',
                        data: totalExpenses,
                        backgroundColor: (ctx) => gradientExpenses(ctx.chart.ctx),
                        borderRadius: 10,
                    },
                    {
                        label: 'Income',
                        data: income,
                        backgroundColor: (ctx) => gradientIncome(ctx.chart.ctx),
                        borderRadius: 10,
                    },
                ],
            });
        });
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Makes the chart adjust to the container's size
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            {chartData ? (
                <Bar
                    data={chartData}
                    options={options}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default IncomeChartByBranches;
