import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const MonthlySalesReportChart = ({ data }) => {
    // Prepare data for the chart
    const chartData = {
        labels: data.map((entry) => entry.date), // Dates as x-axis labels
        datasets: [
            {
                label: "Units Sold",
                data: data.map((entry) => entry.sold),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                yAxisID: "y1",
            },
            {
                label: "Revenues ($)",
                data: data.map((entry) => entry.revenues),
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                yAxisID: "y2",
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Monthly Sale Report",
            },
        },
        scales: {
            y1: {
                type: "linear",
                position: "left",
                title: {
                    display: true,
                    text: "Units Sold",
                },
            },
            y2: {
                type: "linear",
                position: "right",
                title: {
                    display: true,
                    text: "Revenues ($)",
                },
                grid: {
                    drawOnChartArea: false, // Prevent overlapping grid lines
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default MonthlySalesReportChart;
