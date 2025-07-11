import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllCustomer, removeCustomerById } from '../../../../api/Customer';
import * as XLSX from 'xlsx';
import { el } from 'date-fns/locale';
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../../components/table/DataGrid'
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge } from "react-icons/fa";
import { hostName } from '../../../../api/host';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { motion } from 'framer-motion';
import { exportToExcelFiles, globleCardVariants, globleRowVariants, perPage, searchData } from '../../../../api/AppConfig';
import ActionHeader from '../../../../components/listheader/ActionHeader';
import ED from '../../../../components/editRemoveAction/ED';
import RemoveMessage from '../../../../components/alert/RemoveMessage';
const Customer = () => {

    const [customer, setCustomer] = useState([]);
    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r},${g},${b},2)`; // Random color with 60% opacity
    };
    const domainName = hostName();

    const imageUrl = `http://${domainName}:8085/api/images/`

    function getCustomer() {
        getAllCustomer().then((response) => {
            setCustomer(response.data);
            console.log(response.data);

        }).catch(error => {
            console.error(error);
        })
    }
    const [rowsPerPage, setRowsPerPage] = useState(10);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = customer.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(customer.length / rowsPerPage);
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

        const sortedData = [...customer].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setCustomer(sortedData);
    };
    useEffect(() => {
        getCustomer();
    }, [])
    const goto = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getCustomer();
            return
        }
        setCustomer(searchData(customer, searchTerm, ["firstName", "lastName", "email"]));

    }, [searchTerm]);
    function listCard() {
        return (
            <div className="row w-100">

                {
                    currentData.map((o, index) =>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-2 tranform-hover ">
                            <motion.div
                                className="bg-white p-0 pointer border box-shadow"
                                key={o.id}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={globleCardVariants}
                                onClick={() => goto(`/customer-detail/${o.id}`)}
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
                                                                {o.firstName.substring(0, 1)}{o.lastName.substring(0, 1)}
                                                            </div>
                                                        )
                                                }

                                            </div>
                                        </div>
                                        <div className='ps-4 py-3' style={{ width: '60%' }}>
                                            <div className='f-20'>{o.firstName} {o.lastName}</div>
                                            <div className='text-secondary f-14'>
                                                {o.membershipStatus}
                                            </div>

                                            <div className='text-secondary f-14'>
                                                <i class="fa-solid fa-phone px-1 ps-0"></i>{o.phoneNumber}
                                            </div>
                                            <div className='py-2 f-14'><span className='text-badges-warning'><i class="fa-solid fa-envelope px-1 ps-0"></i>{o.email} </span></div>


                                        </div>



                                    </div>
                                </div>
                            </motion.div>
                        </div>
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
                                <Th resizable columnWidth={50}>
                                    <input type="checkbox" name="" className='rounded-0 border pointer px-3' id="" />
                                </Th>
                                <Th
                                    onSort={() => handleSort("id")}
                                    sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""}
                                    resizable
                                    columnWidth={50}
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
                                    Full Name
                                </Th>
                                <Th
                                    onSort={() => handleSort("phoneNumber")}
                                    sortDirection={
                                        sortConfig.key === "phoneNumber" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={120}
                                >
                                    phoneNumber
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
                                    onSort={() => handleSort("city")}
                                    sortDirection={
                                        sortConfig.key === "city" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={70}
                                >
                                    City
                                </Th>
                                <Th
                                    onSort={() => handleSort("city")}
                                    sortDirection={
                                        sortConfig.key === "city" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={70}
                                >
                                    Address
                                </Th>
                                <Th
                                    onSort={() => handleSort("state")}
                                    sortDirection={
                                        sortConfig.key === "state" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={100}

                                >
                                    State
                                </Th>
                                <Th
                                    onSort={() => handleSort("membershipStatus")}
                                    sortDirection={
                                        sortConfig.key === "membershipStatus" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={100}
                                >
                                    JoinDate
                                </Th>
                                <Th columnWidth={100}>Membership</Th>
                                <Th columnWidth={100}>Action</Th>
                            </Thead>
                            <tbody>
                                {
                                    currentData.map((f, i) =>
                                        <motion.tr
                                            key={f.id}
                                            custom={i}
                                            initial="hidden"
                                            animate="visible"
                                            variants={globleRowVariants}
                                            className="pointer" >
                                            <td>
                                                <input type="checkbox" name="" className='rounded-0 border px-3' id="" />
                                            </td>
                                            <td className='py-3'>{f.id}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.firstName} {f.lastName}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.phoneNumber}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.email}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.city}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.city}{"'s "}{f.country}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.state}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.joinDate}</td>
                                            <td onClick={() => goto(`/customer-detail/${f.id}`)}>{f.membershipStatus}</td>
                                            <td>
                                                <ED deleteClick={() => {
                                                    setCustomerId(f.id)
                                                    setIsRemoveOpen(true);
                                                }}
                                                    updateClick={() => goto(`/update-customer/${f.id}`)} />
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

    const [customerId, setCustomerId] = useState();
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);

    function menu() {
        return (
            <div className="list-header-container">
                {/* Left Section */}
                <div className="list-header-left">
                    {/* Add New Button */}
                    <button className="list-header-button add-new box-shadow" onClick={() => goto('/create-customer')}>
                        <FaPlus className="list-header-icon" />
                        Add New
                    </button>
                    <button className="list-header-button print box-shadow">
                        <FaPrint className="list-header-icon" />
                        Print
                    </button>

                    {/* Export Button */}
                    <button className="list-header-button export box-shadow" onClick={() => ExportExcel(customer, "customer-data")}>
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
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="list-header-right">
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
                    {/* Print Button */}

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
    function removeCustomer(id) {
        removeCustomerById(id).then((response) => {
            getCustomer();
        }).catch(e => {

        })
    }
    const [isTable, setIsTable] = useState(false);
    return (
        <>
            <div className='w-100'>
                <div className="container-fluid p-0 ">
                    <div className='container-fluid p-0'>
                        {/* {menu()} */}
                        <ActionHeader
                            btnAddName='New Customer'
                            title="Customer"
                            subtitle="Manage your customer."
                            searchTerm={searchTerm}
                            searchChange={(e) => setSearchTerm(e.target.value)}
                            onCreate={() => goto('/create-customer')}
                            // onPrint={() => setIsPrint(true)}
                            onExport={() => exportToExcelFiles(customer, 'customer_data')}
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

            </div>
            <RemoveMessage
                isOpen={isRemoveOpen}
                description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                message='Are you sure ?'
                cancelClcik={() => setIsRemoveOpen(false)}
                acceptedClick={() => {
                    customerId ? removeCustomer(customerId) : alert('Employee id is null')
                    setCustomerId()
                    setIsRemoveOpen(false);
                }}
            />
        </>
    )
}

export default Customer
