import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { getNetIncomeReport } from "../../../../api/Reporting";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const ChartComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getNetIncomeReport().then((response) => {
            setData(response.data);
        });
    }, []);

    // Extracting data for the chart
    const labels = data.map((item) => item.month);
    const datasets = [
        {
            label: "Revenues",
            data: data.map((item) => item.totalRevenues),
            backgroundColor: "rgba(75, 192, 192, 0.8)", // Teal
            borderColor: "rgba(75, 192, 192, 1)", // Teal Border
            borderWidth: 1,
        },
        {
            label: "Expenses",
            data: data.map((item) => item.totalExpense),
            backgroundColor: "rgba(255, 99, 132, 0.8)", // Pink
            borderColor: "rgba(255, 99, 132, 1)", // Pink Border
            borderWidth: 1,
        },
        {
            label: "Income",
            data: data.map((item) => item.netIncome),
            backgroundColor: "rgba(54, 162, 235, 0.8)", // Blue
            borderColor: "rgba(54, 162, 235, 1)", // Blue Border
            borderWidth: 1,
        },
    ];

    const chartData = {
        labels,
        datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x", // Allow panning in the x-axis
                },
                zoom: {
                    wheel: {
                        enabled: true, // Enable zooming with the mouse wheel
                    },
                    pinch: {
                        enabled: true, // Enable zooming with touch gestures
                    },
                    mode: "x", // Allow zooming in the x-axis
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Months",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Amount (USD)",
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", height: '100%' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default ChartComponent;
