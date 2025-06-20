import React, { useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import * as XLSX from "xlsx";
import TablePagination from "@mui/material/TablePagination";
import './datagrid.css';

const DataGridView = ({ columns, data }) => {
    const [selectedRows, setSelectedRows] = useState({});

    // React Table setup
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page, // Use paginated rows
        setPageSize,
        gotoPage,
        state: { globalFilter, pageIndex, pageSize },
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 }, // Default to first page with 5 rows per page
        },
        useGlobalFilter, // Adds search functionality
        useSortBy, // Adds sorting functionality
        usePagination // Adds pagination functionality
    );

    // Export to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            rows.map((row) => row.original)
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, "DataGridView_Export.xlsx");
    };

    // Toggle the selection of a row
    const toggleRowSelection = (rowId) => {
        setSelectedRows((prevSelected) => {
            const newSelected = { ...prevSelected };
            if (newSelected[rowId]) {
                delete newSelected[rowId]; // Deselect the row
            } else {
                newSelected[rowId] = true; // Select the row
            }
            return newSelected;
        });
    };

    // Get the data of selected rows
    const getSelectedRowsData = () => {
        return rows.filter((row) => selectedRows[row.id]).map((row) => row.original);
    };

    // Access the selected row data when needed
    const handleUseSelectedRowsData = () => {
        const selectedData = getSelectedRowsData();
        // Now you can use selectedData for another function or logic
        console.log("Selected Data: ", selectedData);
        // For example, you can pass it to another function:
        anotherFunction(selectedData);
    };

    // Example function that uses the selected row data
    const anotherFunction = (data) => {
        // Do something with the selected row data
        console.log("Data passed to another function: ", data);
    };

    return (
        <div>
            {/* Search Input */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
                <input
                    type="text"
                    value={globalFilter || ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "300px",
                    }}
                />
                <button
                    onClick={exportToExcel}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Export to Excel
                </button>
            </div>

            {/* Table */}
            <table
                {...getTableProps()}
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                }}
            >
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    style={{
                                        borderBottom: "2px solid #ddd",
                                        padding: "10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                            {/* Add checkbox for selecting multiple rows */}
                            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        const allSelected = rows.every((row) => selectedRows[row.id]);
                                        if (allSelected) {
                                            setSelectedRows({});
                                        } else {
                                            const newSelected = {};
                                            rows.forEach((row) => {
                                                newSelected[row.id] = true;
                                            });
                                            setSelectedRows(newSelected);
                                        }
                                    }}
                                    checked={rows.every((row) => selectedRows[row.id])}
                                    style={{ cursor: "pointer" }}
                                />
                            </th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps()}
                                style={{
                                    backgroundColor: selectedRows[row.id] ? "#f0f8ff" : "white",
                                    cursor: "pointer",
                                }}
                            >
                                {row.cells.map((cell) => (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                                {/* Add individual row checkbox */}
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows[row.id] || false}
                                        onChange={() => toggleRowSelection(row.id)} // Trigger selection toggle
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Updated Pagination */}
            <TablePagination
                component="div"
                count={rows.length} // Total rows available
                page={pageIndex} // Current page index
                onPageChange={(event, newPage) => gotoPage(newPage)} // Update the page
                rowsPerPage={pageSize} // Current rows per page
                onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))} // Update rows per page
                rowsPerPageOptions={[5, 10, 20, 50]} // Options for rows per page
                style={{ marginTop: "20px", width: '100%' }}
            />

            {/* Display selected rows data */}
            <div>
                <h3>Selected Rows Data:</h3>
                <pre>{JSON.stringify(getSelectedRowsData(), null, 2)}</pre>
                {/* Button to use selected data */}
                <button onClick={handleUseSelectedRowsData}>Use Selected Rows Data</button>
            </div>
        </div>
    );
};

export default DataGridView;
