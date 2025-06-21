import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
    zoomPlugin
);

const ExpenseChart = ({ data }) => {
    // Extract data for the chart
    const labels = data.map((entry) => entry.datejournal);
    const totalExpenses = data.map((entry) => entry.totalExpense);

    // Define chart data
    const chartData = {
        labels,
        datasets: [
            {
                label: "Total Expenses",
                data: totalExpenses,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Define chart options
    const options = {
        responsive: true,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // Enable zooming with the mouse wheel
                    },
                    pinch: {
                        enabled: true, // Enable zooming with pinch gestures
                    },
                    mode: "x", // Zoom only on the x-axis
                },
                pan: {
                    enabled: true, // Enable panning
                    mode: "x",
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Total Expense",
                },
            },
        },
    };

    return (
        <div style={{ width: "100%" }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ExpenseChart;
