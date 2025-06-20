import React, { useEffect, useState } from "react";
import { DataGrid, Tr, Thead, Tbody, Th, Td } from "../../../../components/table/DataGrid";
import { getExpenseReport } from "../../../../api/Reporting";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, Filler } from "chart.js";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { IoPrintOutline } from "react-icons/io5";
import { printDoc, userObject } from "../../../../api/AppConfig";
import InputValidation from "../../../../components/input/InputValidation";

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, Filler);

const Expense = () => {
    const [expense, setExpense] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    useEffect(() => {
        getExpenseReport().then((response) => {
            setExpense(response.data);
        });
    }, []);

    // Aggregate expenses by date
    const aggregatedData = expense.reduce((acc, curr) => {
        if (!acc[curr.month]) {
            acc[curr.month] = 0;
        }
        acc[curr.month] += curr.totalExpense;
        return acc;
    }, {});

    // Prepare data for the chart
    const labels = Object.keys(aggregatedData); // Dates
    const dataValues = Object.values(aggregatedData); // Total expenses for each date

    const data = {
        labels,
        datasets: [
            {
                label: "Daily Expenses",
                data: dataValues,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
                tension: 0.4, // Smooth curve
                borderWidth: 2,
                pointBackgroundColor: "#fff",
                pointBorderColor: "rgba(255, 99, 132, 1)",
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
                    label: (context) => `Total Expense: $${context.raw.toFixed(2)}`,
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

    // Sorting logic
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...expense].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setExpense(sortedData);
    };
    const rowsPerPage = 10; // Define how many rows to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = expense.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(expense.length / rowsPerPage);
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const listTable = () => {
        return (
            <DataGrid>
                <table className="">
                    <Thead>
                        <Th columnWidth={50}>No</Th>
                        <Th columnWidth={70} onClick={() => handleSort("month")}>Date (Month)</Th>
                        <Th columnWidth={100} onClick={() => handleSort("expenseAccount")}>Expense Account</Th>
                        <Th columnWidth={80} onClick={() => handleSort("totalExpense")}>Total Expense</Th>
                        <Th resizable onClick={() => handleSort("description")}>Description</Th>
                    </Thead>
                    <Tbody>
                        {currentData.map((e, i) => (
                            <Tr key={i}>
                                <Td>{i + 1}</Td>
                                <Td>{e.month}</Td>
                                <Td>{e.expenseAccount}</Td>
                                <Td>${e.totalExpense.toFixed(2)}</Td>
                                <Td>{e.description}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </table>
            </DataGrid>
        );
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en', {
            weekday: 'long',   // Full day of the week (e.g., "Monday")
            day: '2-digit',    // Two-digit day (e.g., "07")
            month: 'numeric',     // Full month name (e.g., "November")
            year: 'numeric'    // Full year (e.g., "2024")
        }).format(date); // 'dd' for day, 'MMMM' for full month, 'yy' for year
    };
    const [isPrint, setIsPrint] = useState(false);
    function report() {

        return (
            <>
                <div className='fixed-top bg-white p-3 h-100 w-100'>
                    <div className="start" style={{ height: '7%' }}>
                        <button className="button pay px-5 big-shadow py-2" onClick={() => printDoc('revenues', 'revenues_date')}><IoPrintOutline /> <span className='ps-2'>Print</span></button>
                        <div className='ps-3'>
                            <button className="button pay px-5 py-2" onClick={() => setIsPrint(false)}>Cancel</button>
                        </div>
                    </div>
                    <div className='p-2 border bg-silver' style={{ height: '93%', overflow: 'scroll' }} >
                        <div className='animation-opacity bg-white p-2' id='revenues'>
                            <h1 className='display-2 fw-bold text-end' style={{ opacity: 0.2 }}>EXPENSE REPORT</h1>
                            <div className="report-header py-3" >
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <InputValidation
                                            label='Company name :'
                                            value='NFF Group'

                                            fontSize={16}
                                        />
                                        <InputValidation
                                            label='Date :'
                                            fontSize={16}
                                            value={formatDate(new Date())}
                                        />
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <InputValidation
                                            fontSize={16}
                                            label='Report By :'
                                            value={userObject().userName}
                                        />
                                        <InputValidation
                                            fontSize={16}
                                            label='Descriptions : '
                                            value=''
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=''>
                                <Line data={data} options={options} />
                                <DataGrid>
                                    <table>
                                        <Thead>
                                            <Th bg='d' columnWidth={50}>No</Th>
                                            <Th bg='d' columnWidth={70} onClick={() => handleSort("month")}>Date (Month)</Th>
                                            <Th bg='d' columnWidth={100} onClick={() => handleSort("expenseAccount")}>Expense Account</Th>
                                            <Th bg='d' columnWidth={80} onClick={() => handleSort("totalExpense")}>Total Expense</Th>
                                            <Th bg='d' resizable onClick={() => handleSort("description")}>Description</Th>
                                        </Thead>
                                        <Tbody>
                                            {currentData.map((e, i) => (
                                                <Tr key={i}>
                                                    <Td>{i + 1}</Td>
                                                    <Td>{e.month}</Td>
                                                    <Td>{e.expenseAccount}</Td>
                                                    <Td>${e.totalExpense.toFixed(2)}</Td>
                                                    <Td>{e.description}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </table>
                                </DataGrid>
                            </div>
                            <div className="row col-md-6 col-12 py-4">
                                <InputValidation
                                    label='Manager Signature : '
                                    value=''
                                />
                                <InputValidation
                                    label='Date : '
                                    value=''
                                />
                                <InputValidation
                                    label='Comment : '
                                    value=''
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }

    return (
        <div>
            <div style={{ width: "100%", }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="fs-4 ps-3 border-start fw-bold" style={{ opacity: 0.3 }}>
                        EXPENSE
                    </h1>
                    <button className="btn-silver" onClick={() => setIsPrint(true)}>
                        <IoPrintOutline />
                    </button>
                </div>
                <Line data={data} options={options} />
            </div>
            <div className="py-3 d-flex justify-content-between align-items-start">
                <p className="f-16 ps-3 border-start">
                    Expense Reporting
                </p>
                <div className="d-flex end">
                    <span className="page-info f-14 text-secondary px-1">
                        {currentPage} / {totalPages}
                    </span>
                    <div className="pagination">
                        <div className='pe-2'>
                            <button
                                className="button previous"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                <SlArrowLeft />
                            </button>
                        </div>

                        <button
                            className="button next"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            <SlArrowRight />
                        </button>
                    </div>
                </div>
            </div>
            {listTable()}
            {isPrint ? report() : ''}
        </div>
    );
};

export default Expense;
