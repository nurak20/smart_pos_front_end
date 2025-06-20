import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../table/DataGrid';
import RemoveMessage from '../alert/RemoveMessage';
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge } from "react-icons/fa";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { RiEditFill } from 'react-icons/ri';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For printing PDF
import autoTable from 'jspdf-autotable'; // For creating tables in jsPDF

const DataList = ({
    action,
    fetchData,
    deleteDataById,
    columns,
    getImagePath = (item) => item.image,
    onEdit = (id) => { },
    onDetail = (id) => { },
    title,
    exportFileName = "DataList", // Dynamic file name parameter
}) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [isRemove, setIsRemove] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchKey, setSearchKey] = useState(""); // Specific column key to search
    const rowsPerPage = 15; // Items per page
    const navigate = useNavigate();

    // Fetch data on component mount
    useEffect(() => {
        fetchData().then((response) => {
            setData(response.data);
            setFilteredData(response.data);
        }).catch(console.error);
    }, [fetchData]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = data.filter((item) => {
            if (searchKey) {
                // Search specific column
                return item[searchKey]?.toString().toLowerCase().includes(lowercasedQuery);
            }
            // Search all columns
            return columns.some((col) => {
                const value = item[col.key];
                return value?.toString().toLowerCase().includes(lowercasedQuery);
            });
        });
        setFilteredData(filtered);
    }, [searchQuery, searchKey, data, columns]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setFilteredData(sortedData);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const removeData = (id) => {
        deleteDataById(id)
            .then(() => fetchData().then((response) => {
                setData(response.data);
                setFilteredData(response.data);
            }))
            .catch(console.error);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${exportFileName}.xlsx`);
    };

    const printPage = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [columns.map(col => col.label)],
            body: filteredData.map(item => columns.map(col => item[col.key])),
        });
        doc.save(`${exportFileName}.pdf`);
    };

    return (
        <div className="container-fluid p-0 d-block" style={{ overflow: 'scroll' }}>
            <div className="list-header-container">
                <div className="list-header-left">
                    <button className="list-header-button add-new box-shadow" onClick={() => navigate('/create')}>
                        <FaPlus className="list-header-icon" /> Add New
                    </button>
                    <button className="list-header-button print box-shadow" onClick={printPage}>
                        <FaPrint className="list-header-icon" /> Print
                    </button>
                    <button className="list-header-button export box-shadow" onClick={exportToExcel}>
                        <FaFileExport className="list-header-icon" /> Export
                    </button>
                </div>
                <div className="list-header-right">
                    <div className="list-header-search">
                        <FaSearch className="list-header-icon search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="list-header-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="border-0"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                    >
                        <option value="">All Columns</option>
                        {columns.map((col) => (
                            <option key={col.key} value={col.key}>{col.label}</option>
                        ))}
                    </select>
                    <span className="page-info f-14 text-secondary">{currentPage} / {totalPages}</span>
                    <div className="pagination">
                        <button className="button previous" onClick={handlePrevious} disabled={currentPage === 1}>
                            <SlArrowLeft />
                        </button>
                        <div className='ps-2'>
                            <button className="button next" onClick={handleNext} disabled={currentPage === totalPages}>
                                <SlArrowRight />
                            </button>
                        </div>
                    </div>
                    <button className="list-header-button list box-shadow"><FaThList className="list-header-icon" /> List</button>
                    <button className="list-header-button list box-shadow"><FaThLarge className="list-header-icon" /> Card</button>
                    <button className="list-header-button filter box-shadow"><FaFilter className="list-header-icon" /> Filter</button>
                </div>
            </div>
            <div className="cotainer-fluid p-0">
                <DataGrid>
                    <table>
                        <Thead>
                            {columns.map((col) => (
                                <Th
                                    resizable
                                    key={col.key}
                                    onSort={col.sortable ? () => handleSort(col.key) : undefined}
                                    sortDirection={sortConfig.key === col.key ? sortConfig.direction : ""}
                                >
                                    {col.label}
                                </Th>
                            ))}
                            {action ? <Th resizable columnWidth={100}>Action</Th> : ''}
                        </Thead>
                        <Tbody>
                            {currentData.map((item, index) => (
                                <Tr key={item.id}>
                                    {columns.map((col) => (
                                        <Td key={col.key}>{col.render ? col.render(item) : item[col.key]}</Td>
                                    ))}
                                    {action ? <Td>
                                        <div className="d-flex justify-content-start align-items-center w-100">
                                            <span
                                                className="pointer text-badges-danger"
                                                onClick={() => {
                                                    setSelectedId(item.id);
                                                    setIsRemove(true);
                                                }}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </span>
                                            <div className='ps-2'>
                                                <span
                                                    className="pointer text-badges-green"
                                                    onClick={() => onEdit(item.id)}
                                                >
                                                    <RiEditFill />
                                                </span>
                                            </div>
                                        </div>
                                    </Td> : ''}
                                </Tr>
                            ))}
                        </Tbody>
                    </table>
                </DataGrid>
            </div>
            <RemoveMessage
                isOpen={isRemove}
                message="Are you sure?"
                description="This action cannot be undone."
                cancelClcik={() => {
                    setIsRemove(false);
                }}
                acceptedClick={() => {
                    removeData(selectedId);
                    setIsRemove(false);
                }}
            />
        </div>
    );
};

export default DataList;
