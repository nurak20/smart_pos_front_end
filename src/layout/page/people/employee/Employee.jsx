import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllBranch } from '../../../../api/Branch';
import { deleteEmployeeById, getAllEmployee } from '../../../../api/EmployeeApi';
import * as XLSX from 'xlsx';
import { el } from 'date-fns/locale';
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../../components/table/DataGrid'
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge, FaUserEdit, FaSlack } from "react-icons/fa";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { hostName } from '../../../../api/host';
import RemoveMessage from '../../../../components/alert/RemoveMessage';
import { exportToExcelFiles, getDefualtUserId, perPage, searchData, userObject } from '../../../../api/AppConfig';
import { motion } from 'framer-motion';
import { X } from '@mui/icons-material';
import ActionHeader from '../../../../components/listheader/ActionHeader';
import ED from '../../../../components/editRemoveAction/ED';
const Employee = () => {
    const [employee, setEmployee] = useState([]);
    const [branch, setBranch] = useState([]);
    const [employeeId, setEmployeeId] = useState();
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
    function getEmployee() {
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        }).catch(error => {
            console.error(error);
        })
    }
    useEffect(() => {
        getEmployee();
        getBranch();
    }, [])
    function removeEmployeeById(id) {
        if (!id) return
        // alert('employee id' + id + 'has been remove')
        deleteEmployeeById(id).then(reponse => {
            getEmployee();
        }).catch(e => {
            alert(e);
        })
    }

    // Search
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getEmployee();
            return
        }
        setEmployee(searchData(employee, searchTerm, ["firstName", "lastName", "email"]));

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

        const sortedData = [...employee].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setEmployee(sortedData);
    };
    const [rowsPerPage, setRowsPerPage] = useState(10);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    // Define how many rows to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = employee.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(employee.length / rowsPerPage);
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
    const cardVariants = {
        hidden: { opacity: 0, Y: 10 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.06,
                duration: 0.5,
                ease: 'easeOut',
            },
        }),
    };

    const goto = useNavigate();
    function listCard() {
        return (
            <div className="row w-100">

                {
                    currentData.map((o, index) => {
                        if (o.managerID == getDefualtUserId() || userObject().role == 'ADMIN' || o.id == getDefualtUserId()) {
                            return (
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-2 tranform-hover ">
                                    <motion.div
                                        className="p-0 pointer border"

                                        key={o.id}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={cardVariants}
                                        onClick={() => goto(`/employee-detail/${o.id}`)}
                                        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', background: o.id == getDefualtUserId() ? 'rgb(241, 252, 255)' : 'rgb(255, 255, 255)' }}
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
                                                <div className='f-12 ps-2 py-3' style={{ width: '60%' }}>
                                                    <div className='f-20'>{o.firstName} {o.lastName}</div>
                                                    <div className='text-secondary f-14'>{findBranchName(o.companyID)}.</div>

                                                    <p className='text-secondary f-14'>
                                                        <i class="fa-solid fa-phone px-1 ps-0"></i>{o.mobile}
                                                    </p>
                                                    <p className='py-2 f-14'><p className='text-badges-warning p-1'><i class="fa-solid fa-envelope px-1 ps-0"></i>{o.email} </p></p>


                                                </div>


                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )
                        }
                    }

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
                                    Full Name
                                </Th>
                                <Th
                                    onSort={() => handleSort("positionId")}
                                    sortDirection={
                                        sortConfig.key === "positionId" ? sortConfig.direction : ""
                                    }
                                    columnWidth={70}
                                    resizable
                                >
                                    Position
                                </Th>
                                <Th
                                    onSort={() => handleSort("mobile")}
                                    sortDirection={
                                        sortConfig.key === "mobile" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={120}
                                >
                                    Mobile
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
                                    onSort={() => handleSort("workShiftID")}
                                    sortDirection={
                                        sortConfig.key === "workShiftID" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={70}
                                >
                                    workShift
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
                                <Th
                                    onSort={() => handleSort("startWorkingDate")}
                                    sortDirection={
                                        sortConfig.key === "startWorkingDate" ? sortConfig.direction : ""
                                    }
                                    resizable
                                    columnWidth={100}
                                >
                                    startWorkingDate
                                </Th>
                                <Th resizable columnWidth={80}>Action</Th>
                            </Thead>
                            <tbody>
                                {
                                    currentData.map((f, i) => {
                                        if (f.managerID == getDefualtUserId() || userObject().role == 'ADMIN' || f.id == getDefualtUserId()) {
                                            return (
                                                <motion.tr className="pointer"
                                                    key={f.id}
                                                    custom={i}
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={cardVariants}
                                                    onClick={() => goto(`/employee-detail/${o.id}`)}
                                                >
                                                    <td>
                                                        <input type="checkbox" name="" className='rounded-0 border px-3' id="" />
                                                    </td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} className='py-3'>{i + 1}</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >{f.firstName} {f.lastName}</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >Sofware Developer</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >{f.mobile}</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >{f.email}</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >{f.workShiftID}</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >{f.address}</td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} > <span className='text-badges-warning'>{findBranchName(f.companyID)}</span></td>
                                                    <td onClick={() => goto(`/employee-detail/${f.id}`)} >{f.startWorkingDate}</td>
                                                    <td>
                                                        <ED
                                                            deleteClick={() => {
                                                                setIsRemoveOpen(true)
                                                                setEmployeeId(f.id)
                                                            }}
                                                            updateClick={() => goto(`/update-employee/${f.id}`)}
                                                        />

                                                    </td>



                                                </motion.tr>
                                            )
                                        }
                                    }
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


    return (
        <>
            <div className='w-100'>
                <div className="container-fluid p-0 ">
                    <div className='container-fluid p-0'>
                        <ActionHeader
                            btnAddName='New Employee'
                            title="Employee"
                            subtitle="Manage your employee inventory"
                            searchTerm={searchTerm}
                            searchChange={(e) => setSearchTerm(e.target.value)}
                            onCreate={() => goto('/create-employee')}
                            // onPrint={() => setIsPrint(true)}
                            onExport={() => exportToExcelFiles(employee, 'employee_data')}
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
                        employeeId ? removeEmployeeById(employeeId) : alert('Employee id is null')
                        setEmployeeId()
                        setIsRemoveOpen(false);
                    }}
                />

            </div>
        </>
    )
}

export default Employee
