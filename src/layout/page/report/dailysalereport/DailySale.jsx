import React, { useEffect, useState } from 'react'
import DailySaleChart from './DailySaleChart'
import { dailyDaleReporting } from '../../../../api/Reporting'
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../../components/table/DataGrid';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
const DailySale = () => {
    const [report, setReport] = useState([]);
    useEffect(() => {
        dailyDaleReporting().then((response) => {
            setReport(response.data);
        })
    }, [])
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const rowsPerPage = 7; // Define how many rows to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = report.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(report.length / rowsPerPage);
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
                        <Th columnWidth={100}>Date (Month)</Th>
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
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-md-8 col-12">
                        <DailySaleChart data={report} />
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
        </>
    )
}

export default DailySale
