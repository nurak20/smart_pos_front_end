import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllBranch } from '../../../../api/Branch';

import * as XLSX from 'xlsx';
import { el } from 'date-fns/locale';
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../../components/table/DataGrid'
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge, FaUserEdit, FaSlack } from "react-icons/fa";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { hostName } from '../../../../api/host';
import RemoveMessage from '../../../../components/alert/RemoveMessage';
import { exportToExcelFiles, globleCardVariants, globleRowVariants, perPage, searchData } from '../../../../api/AppConfig';
import { deleteVendor, getAllVendor } from '../../../../api/Vendor';
import ActionHeader from '../../../../components/listheader/ActionHeader';
import { motion } from 'framer-motion';
import ED from '../../../../components/editRemoveAction/ED';
const ViewVendor = () => {
    const [vendor, setVendor] = useState([]);
    const [branch, setBranch] = useState([]);
    const [vendorId, setVendorId] = useState();
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r},${g},${b},0.9)`; // Random color with 60% opacity
    };
    const domainName = hostName();
    const imageUrl = `http://${domainName}:8085/api/images/`
    // get all employee
    function getListVendor() {
        getAllVendor().then((response) => {
            setVendor(response.data);
        }).catch(error => {
            console.error(error);
        })
    }
    useEffect(() => {
        getListVendor();
        getBranch();
    }, [])
    function removeVendor(id) {
        if (!id) return
        // alert('employee id' + id + 'has been remove')
        deleteVendor(id).then(reponse => {
            getListVendor();
            setVendorId()
            setIsRemoveOpen(false);
        }).catch(e => {
            alert(e);
        })
    }

    // Search
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getListVendor();
            return
        }
        setVendor(searchData(vendor, searchTerm, ["displayName", "companyName", "email"]));

    }, [searchTerm]);



    function getBranch() {
        getAllBranch().then((response) => {
            setBranch(response.data);
            console.log(response.data);

        }).catch(error => {
            console.error(error);
        })
    }
    function findBranchName(id) {
        const objBracnh = branch.find(b => b.id == id);
        if (objBracnh) {
            return objBracnh.branchName;
        } else {
            return "No Branch"
        }

    }
    const ExportExcel = (data, fileName) => {
        // 1. Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 2. Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // 3. Write the workbook to an Excel file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...vendor].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setVendor(sortedData);
    };
    const [rowsPerPage, setRowsPerPage] = useState(10);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = vendor.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(vendor.length / rowsPerPage);
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

    const goto = useNavigate();
    function listCard() {
        return (
            <div className="row w-100">

                {
                    currentData.map((o, i) =>
                        <motion.div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-2"
                            key={o.id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={globleCardVariants}
                        >
                            <div className="tranform-hover bg-white p-0 pointer border"
                                onClick={() => goto(`/vendor-detail/${o.id}`)}
                                style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
                            >
                                <div className="card-body p-0">
                                    <div className="d-flex">
                                        <div className="center p-1" style={{ width: '40%' }}>
                                            <div className="center" style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
                                                {
                                                    o.image ?
                                                        (<img src={`${imageUrl}${o.image}`} alt="" className='w-100' />)
                                                        : (
                                                            // if no image
                                                            <div className="h-100 text-white w-100 fs-1 center" style={{ backgroundColor: generateRandomColor() }}>
                                                                {o.displayName.substring(0, 1)}
                                                            </div>
                                                        )
                                                }

                                            </div>
                                        </div>
                                        <div className='f-12 ps-2 py-3' style={{ width: '60%' }}>
                                            <div className='f-20'>{o.displayName}</div>
                                            <p className='text-secondary f-14'>
                                                <i class="fa-solid fa-phone px-1 ps-0"></i>{o.phone}
                                            </p>
                                            <div className='py-2 f-14'><span className='text-badges-warning p-1'><i class="fa-solid fa-envelope px-1 ps-0"></i>{o.email} </span></div>


                                        </div>


                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </div>
        )
    }
    function listTable() {
        return (
            <div className="card border-0 w-100">
                <div className="card-body p-0 border-0">
                    <DataGrid>
                        <table>
                            <Thead>
                                <Th columnWidth={20}>
                                    <input type="checkbox" name="" className='rounded-0 border pointer px-3' id="" />
                                </Th>
                                <Th
                                    onSort={() => handleSort("id")}
                                    sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""}

                                    columnWidth={20}
                                >
                                    No
                                </Th>
                                <Th
                                    onSort={() => handleSort("firstName")}
                                    sortDirection={
                                        sortConfig.key === "firstName" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={150}
                                >
                                    Display Name
                                </Th>
                                <Th
                                    onSort={() => handleSort("mobile")}
                                    sortDirection={
                                        sortConfig.key === "mobile" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={120}
                                >
                                    Phone
                                </Th>

                                <Th
                                    onSort={() => handleSort("email")}
                                    sortDirection={
                                        sortConfig.key === "email" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={100}

                                >
                                    Email
                                </Th>
                                <Th
                                    onSort={() => handleSort("address")}
                                    sortDirection={
                                        sortConfig.key === "address" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={70}
                                >
                                    Address
                                </Th>
                                <Th
                                    onSort={() => handleSort("companyID")}
                                    sortDirection={
                                        sortConfig.key === "companyID" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={150}

                                >
                                    Company
                                </Th>
                                <Th resizable columnWidth={80}>Action</Th>
                            </Thead>
                            <tbody>
                                {
                                    currentData.map((f, i) =>
                                        <motion.tr className="pointer"
                                            key={f.id}
                                            custom={i}
                                            initial="hidden"
                                            animate="visible"
                                            variants={globleRowVariants}
                                        >
                                            <td>
                                                <input type="checkbox" name="" className='rounded-0 border px-3' id="" />
                                            </td>
                                            <td onClick={() => goto(`/vendor-detail/${f.id}`)} className='py-3'>{i + 1}</td>
                                            <td onClick={() => goto(`/vendor-detail/${f.id}`)} >{f.displayName}</td>
                                            <td onClick={() => goto(`/vendor-detail/${f.id}`)} >{f.phone}</td>
                                            <td onClick={() => goto(`/vendor-detail/${f.id}`)} >{f.email}</td>
                                            <td onClick={() => goto(`/vendor-detail/${f.id}`)} >{f.address}</td>
                                            <td onClick={() => goto(`/vendor-detail/${f.id}`)} > <span className='text-badges-warning'>{f.companyName}</span></td>
                                            <td>
                                                <ED
                                                    deleteClick={() => {
                                                        setIsRemoveOpen(true)
                                                        setVendorId(f.id)
                                                    }}
                                                    updateClick={() => goto(`/update-vendor/${f.id}`)}
                                                />

                                            </td>



                                        </motion.tr>
                                    )
                                }
                            </tbody>

                        </table>
                    </DataGrid>

                </div>
            </div>
        )
    }
    // display if table view or card view
    const [isTable, setIsTable] = useState(false);




    function menu() {
        return (
            <div className="list-header-container">
                {/* Left Section */}
                <div className="list-header-left">
                    {/* Add New Button */}
                    <button className="list-header-button add-new box-shadow" onClick={() => goto('/create-vendor')}>
                        <FaPlus className="list-header-icon" />
                        Add New
                    </button>
                    <button className="list-header-button print box-shadow">
                        <FaPrint className="list-header-icon" />
                        Print
                    </button>

                    {/* Export Button */}
                    <button className="list-header-button export box-shadow" onClick={() => ExportExcel(vendor, "vendor-data")}>
                        <FaFileExport className="list-header-icon" />
                        Export
                    </button>

                    {/* Search Input */}

                </div>
                <div className="list-header-right">
                    <div className="list-header-search">
                        <FaSearch className="list-header-icon search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="list-header-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="list-header-right">
                    {/* Print Button */}
                    <span className="page-info f-14 text-secondary">
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

                    <button className="list-header-button list box-shadow" onClick={() => setIsTable(true)}>
                        <FaThList className="list-header-icon" />
                        List
                    </button>

                    {/* Export Button */}
                    <button className="list-header-button list box-shadow" onClick={() => setIsTable(false)}>
                        <FaThLarge className="list-header-icon" />
                        Card
                    </button>
                    {/* Filter Button */}
                    <button className="list-header-button filter box-shadow">
                        <FaFilter className="list-header-icon" />
                        Filter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='w-100'>
                <div className="container-fluid p-0 ">
                    <div className='container-fluid p-0'>
                        <ActionHeader
                            btnAddName='New Vendor'
                            title="Vendor"
                            subtitle="Manage your vendor inventory"
                            searchTerm={searchTerm}
                            searchChange={(e) => setSearchTerm(e.target.value)}
                            onCreate={() => goto('/create-vendor')}
                            // onPrint={() => setIsPrint(true)}
                            onExport={() => exportToExcelFiles(vendor, 'vendor_data')}
                            perPage={perPage()}
                            selectPerPage={selectPerPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handleNext={handleNext}
                            handlePrevious={handlePrevious}
                            isTableAction={() => isTable ? setIsTable(false) : setIsTable(true)}
                        />
                    </div>

                </div>
                <div className="center">
                    {isTable ? listTable() : listCard()}
                </div>

                <RemoveMessage
                    isOpen={isRemoveOpen}
                    description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                    message='Are you sure ?'
                    cancelClcik={() => setIsRemoveOpen(false)}
                    acceptedClick={() => {
                        vendorId ? removeVendor(vendorId) : alert('Employee id is null')

                    }}
                />

            </div>
        </>
    )
}

export default ViewVendor
