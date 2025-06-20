import React, { useEffect, useState } from "react";
import { DataGrid, Tr, Thead, Tbody, Th, Td } from "../../../../components/table/DataGrid";
import { getExpenseReport, getRevenuesReport } from "../../../../api/Reporting";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, Filler } from "chart.js";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { IoPrintOutline } from "react-icons/io5";
import InputValidation from "../../../../components/input/InputValidation";
import { printDoc, userObject } from "../../../../api/AppConfig";

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, Filler);

const RevenuesChart = () => {
    const [revenues, setRevenues] = useState([]);

    useEffect(() => {
        getRevenuesReport().then((response) => {
            setRevenues(response.data);
        });
    }, []);

    // Aggregate expenses by date
    const aggregatedData = revenues.reduce((acc, curr) => {
        if (!acc[curr.month]) {
            acc[curr.month] = 0;
        }
        acc[curr.month] += curr.totalRevnues;
        return acc;
    }, {});

    // Prepare data for the chart
    const labels = Object.keys(aggregatedData); // Dates
    const dataValues = Object.values(aggregatedData); // Total expenses for each date

    const data = {
        labels,
        datasets: [
            {
                label: "Monthly Revenues",
                data: dataValues,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if (!chartArea) {
                        return null;
                    }

                    // Create a gradient
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, "rgba(75, 192, 192, 0.3)"); // Light teal
                    gradient.addColorStop(1, "rgba(29, 132, 118, 0.7)"); // Dark teal

                    return gradient;
                },
                borderColor: "rgb(29, 132, 118)",
                fill: true,
                tension: 0.4, // Smooth curve
                borderWidth: 2,
                pointBackgroundColor: "#fff",
                pointBorderColor: "rgb(29, 132, 118)",
                pointRadius: 4, // Rounded points
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Total Revenues: $${context.raw.toFixed(2)}`,
                },
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
            y: {
                beginAtZero: true,
            },
        },
    };




    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

export default RevenuesChart;
