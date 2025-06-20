import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from '../loading/Loading'
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../components/table/DataGrid'
import { getAllBranch, removeBranchById } from '../../../api/Branch'
import { hostName } from '../../../api/host'
import { RiEditFill } from 'react-icons/ri'
import RemoveMessage from '../../../components/alert/RemoveMessage'
import { exportToExcelFiles, perPage, printDoc, searchData, userObject } from '../../../api/AppConfig'
import InputValidation from '../../../components/input/InputValidation'
import { IoPrintOutline } from 'react-icons/io5'
import { motion } from 'framer-motion';
import ActionHeader from '../../../components/listheader/ActionHeader'
import { getAllEmployee } from '../../../api/EmployeeApi'
import { Avatar, AvatarGroup } from '@mui/material'
const Company = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);
    const [product, setProduct] = useState([]);
    const [branch, setBranch] = useState([]);
    const domainName = hostName();
    const [employee, setEmployee] = useState([]);
    const [productId, setProductId] = useState();
    useEffect(() => {
        getData();
    }, [])
    const rowVariants = {
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
    function getData() {
        getAllBranch().then((respnse) => {
            setBranch(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        }).catch(error => {
            console.error(error);
        })
    }
    const navigate = useNavigate();
    function findStatus(value) {
        if (value == 'Active') {
            return (
                <>
                    <span class="text-badges-green"><i class="fa-solid fa-check"></i> Active</span>

                </>
            )
        } else {
            return (
                <>
                    <span class="text-badges-danger"><i class="fa-solid fa-check"></i>None Active</span>
                </>
            )
        }

    }

    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...branch].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setBranch(sortedData);
    };
    function listCard() {
        const rowVariants = {
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

        return (
            <div className="row w-100 expand ps-1">
                {currentData.map((o, index) => (
                    <motion.div
                        className="col-xl-6 col-12 p-2"
                        key={o.id}
                        custom={index} // Pass index for staggered animation
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div
                            onClick={() => navigate(`/company-detail/${o.id}`)}  // Navigate to branch detail
                            className="bg-white p-0 pointer border transform-hover"
                            style={{
                                height: '250px',  // Adjusted height for branch cards
                                overflow: 'hidden',
                                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                            }}
                        >
                            <div className="card-body border-0 p-0 h-100">
                                <div className="d-flex text-start h-100">
                                    <div
                                        className="p-2 center"
                                        style={{ height: '250px', overflow: 'hidden', width: '47%' }}
                                    >
                                        <img
                                            src={`http://${domainName}:8085/api/images/${o.image}`}  // Use branch image
                                            alt="Branch Image"
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="f-14 p-2" style={{ overflow: 'hidden', width: '53%' }}>
                                        <div className="f-20 text-title">{o.branchName}</div>
                                        <div className="text-secondary f-14">{o.city}, {o.state}</div>
                                        <div className="py-2">
                                            <span className="f-14 text-badges-red">Branch Manager: {employee ? employee.find(e => e.id == o.managerId).firstName + ' ' + employee.find(e => e.id == o.managerId).lastName : ''}</span>
                                        </div>
                                        <div className="py-2">
                                            <span className="f-14 text-badges-warning">Established: {new Date(o.establishedDate).toLocaleDateString()}</span>
                                        </div>
                                        {/* <textarea
                                            className="border-0 text-secondary w-100 py-2 h-100 f-10"
                                            value={o.addressLine1 + ' ' + o.addressLine2}
                                            readOnly
                                        ></textarea> */}
                                        <AvatarGroup
                                            spacing="medium"
                                            max={3}
                                            sx={{
                                                justifyContent: "start", // Align avatars to the start
                                                "& .MuiAvatar-root": {
                                                    marginLeft: "-8px", // Adjust the overlap or spacing between avatars
                                                },
                                            }}
                                        >
                                            {employee.map((p) => {

                                                if (p.companyID == o.id) {
                                                    return (
                                                        <>
                                                            <Avatar
                                                                key={p.id} // Add a unique key for each Avatar
                                                                alt={p.name || "Product Avatar"} // Add a descriptive alt text
                                                                src={`http://${domainName}:8085/api/images/${p.image}`}
                                                            />
                                                        </>
                                                    )
                                                }
                                            })}
                                        </AvatarGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

            </div>
        );

    }
    const [rowsPerPage, setRowPerPage] = useState(15);

    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = branch.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(branch.length / rowsPerPage);
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


    function listTable() {


        return (
            <div className='animation-opacity pe-1'>
                <DataGrid>
                    <table>
                        <Thead>
                            <Th onSort={() => handleSort("id")} sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""} resizable columnWidth={50}>No</Th>
                            <Th onSort={() => handleSort("branchName")} sortDirection={sortConfig.key === "branchName" ? sortConfig.direction : ""} resizable columnWidth={150}>BranchName</Th>
                            <Th onSort={() => handleSort("branchCode")} sortDirection={sortConfig.key === "branchCode" ? sortConfig.direction : ""} resizable columnWidth={120}>BranchCode</Th>
                            <Th onSort={() => handleSort("addressLine1")} sortDirection={sortConfig.key === "addressLine1" ? sortConfig.direction : ""} resizable columnWidth={150}>Address Line 1</Th>
                            <Th onSort={() => handleSort("addressLine2")} sortDirection={sortConfig.key === "addressLine2" ? sortConfig.direction : ""} resizable columnWidth={150}>Address Line 2</Th>
                            <Th onSort={() => handleSort("city")} sortDirection={sortConfig.key === "city" ? sortConfig.direction : ""} resizable columnWidth={100}>City</Th>
                            <Th onSort={() => handleSort("state")} sortDirection={sortConfig.key === "state" ? sortConfig.direction : ""} resizable columnWidth={100}>State</Th>
                            <Th onSort={() => handleSort("postalCode")} sortDirection={sortConfig.key === "postalCode" ? sortConfig.direction : ""} resizable columnWidth={100}>PostalCode</Th>
                            <Th onSort={() => handleSort("country")} sortDirection={sortConfig.key === "country" ? sortConfig.direction : ""} resizable columnWidth={100}>Country</Th>
                            <Th onSort={() => handleSort("phoneNumber")} sortDirection={sortConfig.key === "phoneNumber" ? sortConfig.direction : ""} resizable columnWidth={120}>PhoneNumber</Th>
                            <Th onSort={() => handleSort("email")} sortDirection={sortConfig.key === "email" ? sortConfig.direction : ""} resizable columnWidth={150}>Email</Th>
                            <Th onSort={() => handleSort("managerName")} sortDirection={sortConfig.key === "managerName" ? sortConfig.direction : ""} resizable columnWidth={150}>ManagerName</Th>
                            <Th onSort={() => handleSort("establishedDate")} sortDirection={sortConfig.key === "establishedDate" ? sortConfig.direction : ""} resizable columnWidth={120}>Established Date</Th>
                            <Th onSort={() => handleSort("status")} sortDirection={sortConfig.key === "status" ? sortConfig.direction : ""} resizable columnWidth={100}>Status</Th>
                        </Thead>
                        <Tbody>
                            {currentData.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    className='animation-opacity'
                                    custom={index} // Pass index for staggered delay
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    onClick={() => navigate(`/company-detail/${item.id}`)}
                                >
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.id}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.branchName}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.branchCode}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.addressLine1}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.addressLine2}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.city}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.state}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.postalCode}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.country}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.phoneNumber}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.email}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{item.managerId}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{new Date(item.establishedDate).toLocaleDateString()}</td>
                                    <td onClick={() => goto(`/branch-detail/${item.id}`)}>{findStatus(item.status)}</td>
                                </motion.tr>
                            ))}
                        </Tbody>
                    </table>
                </DataGrid>
            </div>
        );

    }


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
                        <button className="btn-silver px-5 big-shadow py-2" onClick={() => printData()}><IoPrintOutline /> <span className='ps-2'>Print</span></button>
                        <div className='ps-3'>
                            <button className="btn-silver cancel px-5 py-2" onClick={() => setIsPrint(false)}>Cancel</button>
                        </div>
                    </div>
                    <div className='p-2 border bg-silver' style={{ height: '93%', overflow: 'scroll' }} >

                    </div>

                </div>
            </>
        )
    }



    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getData();
            return
        }
        setBranch(searchData(branch, searchTerm, ["branchName"]));

    }, [searchTerm]);
    function printData() {
        try {
            printDoc('data', 'branch_data', userObject().userName, 'Product data');
        } catch (e) {

        }

    }

    function selectPerPage(selected) {
        setRowPerPage(selected.value);
    }
    function exportFile() {
        exportToExcelFiles(branch, 'product_data');
    }


    useEffect(() => {
        // Set a timeout to hide the loading screen after 0.5 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        // Cleanup the timer
        return () => clearTimeout(timer);
    }, [isLoading]);
    useEffect(() => {
        // Set a timeout to hide the loading screen after 0.5 seconds
        const timer = setTimeout(() => {
            setIsLoadingRemove(false);
        }, 8000);
        // Cleanup the timer
        return () => {
            clearTimeout(timer)

        };

    }, [isLoadingRemove]);
    const [isTable, setIsTable] = useState(false);


    function removeProduct(id) {
        if (id) {
            removeBranchById(id).then((respnse) => {
                getData();
            }).catch(e => {
                alert(e);
            })
        }
    }
    return (
        <>
            <div className='w-100'>
                <div className="container-fluid p-0 ">
                    <div className='container-fluid p-0'>
                        <ActionHeader
                            btnAddName='New Product'
                            title="Products"
                            subtitle="Manage your product inventory"
                            searchTerm={searchTerm}
                            searchChange={(e) => setSearchTerm(e.target.value)}
                            onCreate={() => navigate('/create-branch')}
                            onPrint={() => setIsPrint(true)}
                            onExport={exportFile}
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
                <div>
                    {isLoading ? (
                        // Loading Screen
                        <>
                            <Loading />
                        </>
                    ) : (
                        // Main Content
                        <>{isTable ? listTable() : listCard()}</>
                    )}
                </div>
                <RemoveMessage
                    cancelClcik={() => setIsLoadingRemove(false)}
                    acceptedClick={() => {
                        setIsLoadingRemove(false);
                        removeProduct(productId);
                        setProductId();
                    }}
                    message='Are you sure ?'
                    description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                    isOpen={isLoadingRemove}
                />




            </div>
            {isPrint ? report() : ''}
        </>
    )
}

export default Company
