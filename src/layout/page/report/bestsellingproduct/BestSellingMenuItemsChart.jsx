import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-zoom'; // Ensure this plugin is installed
import { getAllProductSoldReport } from '../../../../api/Procedure';
import { getSaleReport } from '../../../../api/Reporting';
import SalesChart from './SalesChart';
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../../components/table/DataGrid';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to generate random rgba color
const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r},${g},${b},0.6)`; // Random color with 60% opacity
};

const BestSellingMenuItemsChart = () => {

    const [saleReport, setSaleReport] = useState([]);
    useEffect(() => {
        getSaleReport().then((reponse) => {
            setSaleReport(reponse.data);
        })
    }, [])
    const rowsPerPage = 10; // Define how many rows to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = saleReport.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(saleReport.length / rowsPerPage);
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
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const listTable = () => {
        return (
            <DataGrid>
                <table className="">
                    <Thead>
                        <Th resizable>No</Th>
                        <Th resizable >Date (Month)</Th>
                        <Th resizable >Product</Th>
                        <Th resizable >Total Sold</Th>
                        <Th resizable >Revenues</Th>
                    </Thead>
                    <Tbody>
                        {currentData.map((e, i) => (
                            <Tr key={i}>
                                <Td>{i + 1}</Td>
                                <Td>{e.date}</Td>
                                <Td>{e.productName}</Td>
                                <Td>{e.totalSold}</Td>
                                <Td>${formatCurrency.format(e.revenues)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </table>
            </DataGrid>
        );
    };
    return (
        <>
            <SalesChart data={saleReport} />
            <div className="d-flex end mb-2">
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
            {listTable()}

        </>
    );
};

export default BestSellingMenuItemsChart;
