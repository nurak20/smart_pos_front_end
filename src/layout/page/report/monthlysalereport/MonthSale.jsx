import React from 'react'
import MonthlySalesReportChart from './MonthlySalesReportChart';
import { useState, useEffect } from 'react';
import { monthlySaleReporting } from '../../../../api/Reporting';
import { useNavigate } from 'react-router-dom';
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../../components/table/DataGrid';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
const MonthSale = () => {
    const goto = useNavigate();
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    useEffect(() => {
        monthlySaleReporting().then(response => {
            console.log(response.data);

            setMonthlySalesData(response.data);

        }).catch(e => {
            console.error(e);
        })
    }, [])

    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en', {
            weekday: 'long',   // Full day of the week (e.g., "Monday")
            day: '2-digit',    // Two-digit day (e.g., "07")
            month: 'numeric',     // Full month name (e.g., "November")
            year: 'numeric'    // Full year (e.g., "2024")
        }).format(date); // 'dd' for day, 'MMMM' for full month, 'yy' for year
    };
    const rowsPerPage = 7; // Define how many rows to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = monthlySalesData.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(monthlySalesData.length / rowsPerPage);
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
                        <Th resizable>Date (Month)</Th>
                        <Th columnWidth={50}>Sold</Th>
                        <Th resizable>Total Revenues</Th>
                    </Thead>
                    <Tbody>
                        {currentData.map((e, i) => (
                            <Tr key={i}>
                                <Td>{i + 1}</Td>
                                <Td>{e.date}</Td>
                                <Td>{e.sold}</Td>
                                <Td>${formatCurrency.format(e.revenues)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </table>
            </DataGrid>
        );
    };
    return (
        <div>
            <div className="row">
                <div className="col-md-8 col-12">
                    <div className="w-100">
                        <MonthlySalesReportChart data={monthlySalesData} />
                    </div>
                </div>
                <div className="col-md-4 col-12">
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
                </div>
            </div>
        </div>
    )
}

export default MonthSale
