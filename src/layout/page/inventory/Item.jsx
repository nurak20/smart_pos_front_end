import { Link } from 'react-router-dom'
import './item.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllProduct, removeProductById } from '../../../api/Product'
import Loading from '../loading/Loading'
import { Tbody, Td, Th, Thead, Tr } from '../../../components/table/DataGrid'
import { getAllCategory } from '../../../api/Category'
import { getAllBranch } from '../../../api/Branch'
import ListHeader from '../../../components/listheader/ActionHeader'
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge, FaUserEdit } from "react-icons/fa";
import { hostName } from '../../../api/host'
import { format, set } from 'date-fns';
import * as XLSX from 'xlsx';
import RemoveLoading from '../loading/RemoveLoading'
import { RiDeleteBin5Line, RiEditFill } from 'react-icons/ri'
import { id } from 'date-fns/locale'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import RemoveMessage from '../../../components/alert/RemoveMessage'
import { exportToExcelFiles, perPage, printDoc, searchData, userObject } from '../../../api/AppConfig'
import { Label, X } from '@mui/icons-material'
import InputValidation from '../../../components/input/InputValidation'
import { IoPrintOutline, IoRemove } from 'react-icons/io5'
import { motion } from 'framer-motion';
import ActionHeader from '../../../components/listheader/ActionHeader'
import CustomCommoBox from '../../../components/select/CustomCommoBox'
import { LiaSearchSolid } from 'react-icons/lia'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Paper } from '@mui/material'
import { getAllEmployee, getEmployee } from '../../../api/EmployeeApi'
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from 'react-icons/ci'
import ED from '../../../components/editRemoveAction/ED'
const Item = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);
    const [product, setProduct] = useState([]);
    const [category, setCategories] = useState([]);
    const [branch, setBranch] = useState([]);
    const [employee, setEmployee] = useState([]);
    const domainName = hostName();
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
        getAllProduct().then((respnse) => {
            setProduct(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
        getAllBranch().then((respnse) => {
            setBranch(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
        getAllCategory().then((respnse) => {
            setCategories(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        })
    }
    const navigate = useNavigate();
    function findStatus(value) {
        if (value == 1) {
            return (
                <>
                    <span class="text-badges-green"><i class="fa-solid fa-check"></i> Active</span>

                </>
            )
        } else if (value == 2) {
            return (
                <>
                    <span class="text-badges-danger"><i class="fa-solid fa-check"></i>None Active</span>
                </>
            )
        }

    }
    function findBranchName(id) {
        try {
            return branch.find(b => b.id == id).branchName;
        } catch (e) {
            return "Error";
        }

    }
    function findCategoryName(id) {
        try {
            return category.find(c => c.id == id).name;;
        } catch (e) {
            return "Error";
        }

    }

    function findEmployeeIamge(id) {
        if (id) {
            const emp = employee.find(e => e.id == id);
            if (emp) {
                return (
                    <>
                        <div className="d-flex">
                            <img src={`http://${domainName}:8085/api/images/${emp.image}`} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                            <div className="d-block">

                                <div className='f-14 text-secondary ps-2'>{emp.firstName} {emp.lastName}</div>
                            </div>
                        </div>

                    </>
                )
            }
            return 'No Image'

        }
        return 'No Image'
    }
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...product].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setProduct(sortedData);
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
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-2"
                        key={o.id}
                        custom={index} // Pass index for staggered animation
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"

                    >
                        <Paper elevation={1}
                            onClick={() => navigate(`/item-detail/${o.id}`)}
                            className="bg-white p-0 pointer border tranform-hover"
                            sx={
                                {
                                    transition: '0.2s',
                                    height: 180,
                                    overflow: 'scroll'
                                }
                            }
                        >
                            <div

                            >
                                <div className="card-body border-0 p-0 h-100">
                                    <div className="d-flex text-start h-100">
                                        <div
                                            className="p-2 center"
                                            style={{ height: '180px', overflow: 'hidden', width: '47%' }}
                                        >
                                            <img
                                                src={`http://${domainName}:8085/api/images/${o.image}`}
                                                alt="Image"
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="f-14 p-2" style={{ overflow: 'hidden', width: '53%' }}>
                                            <div className="f-20 display-name">{o.productName}</div>
                                            <div className="text-secondary f-14">{findCategoryName(o.categoryId)}</div>
                                            <div className="py-2">
                                                <span className="f-14 text-badges-red">Price : ${o.price}</span>
                                            </div>
                                            <p className="f-14">
                                                {o.description}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Paper>

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
    const currentData = product.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(product.length / rowsPerPage);
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
            <>
                <Paper sx={{ height: '100%', width: '100%' }}>
                    <table>
                        <Thead>
                            <Th
                                onSort={() => handleSort("id")}
                                sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""}
                                resizable
                                columnWidth={50}

                            >
                                No
                            </Th>
                            <Th
                                onSort={() => handleSort("productName")}
                                sortDirection={
                                    sortConfig.key === "productName" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={150}

                            >
                                ProductName
                            </Th>
                            <Th
                                onSort={() => handleSort("price")}
                                sortDirection={
                                    sortConfig.key === "price" ? sortConfig.direction : ""
                                }
                                columnWidth={100}

                                resizable
                            >
                                Price
                            </Th>
                            <Th resizable columnWidth={200}> Description</Th>
                            <Th
                                onSort={() => handleSort("categoryId")}
                                sortDirection={
                                    sortConfig.key === "categoryId" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={120}

                            >
                                Category
                            </Th>

                            <Th
                                onSort={() => handleSort("branchId")}
                                sortDirection={
                                    sortConfig.key === "branchId" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={150}


                            >
                                BranchId
                            </Th>
                            <Th
                                onSort={() => handleSort("calories")}
                                sortDirection={
                                    sortConfig.key === "calories" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={70}

                            >
                                Calories
                            </Th>
                            <Th
                                onSort={() => handleSort("status")}
                                sortDirection={
                                    sortConfig.key === "status" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={100}


                            >
                                Status
                            </Th>
                            <Th
                                onSort={() => handleSort("productOrigin")}
                                sortDirection={
                                    sortConfig.key === "productOrigin" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={100}

                            >
                                ProductOrigin
                            </Th>

                            <Th
                                resizable
                                columnWidth={130}

                            >
                                Action
                            </Th>

                        </Thead>
                        <Tbody>
                            {currentData.map((item) => (
                                <tr key={item.id}>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{item.id}</td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{item.productName}</td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}> <span className='text-badges-red bold'>{formatCurrency.format(item.price)}</span></td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{item.description}</td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{findCategoryName(item.categoryId)}</td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}> <span className='text-badges-warning'>{findBranchName(item.branchId)}</span></td>

                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{item.calories} </td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{findStatus(item.status)}</td>
                                    <td onClick={() => navigate(`/item-detail/${item.id}`)}>{item.productOrigin}</td>
                                    <td >
                                        <ED
                                            deleteClick={() => {
                                                setProductId(item.id);
                                                setIsLoadingRemove(true);
                                            }}
                                            updateClick={() => navigate(`/update-item/${item.id}`)}
                                        />
                                    </td>

                                </tr>
                            ))}
                        </Tbody>
                    </table>
                </Paper>
            </>
        )
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
                        <div className='animation-opacity bg-white p-2' id='data'>
                            <h1 className='display-2 fw-bold text-end' style={{ opacity: 0.2 }}>PRODUCT REPORT</h1>
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
                            <div className='border'>
                                <DataGrid>
                                    <table >
                                        <Thead>
                                            <Th
                                                onSort={() => handleSort("id")}
                                                sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""}
                                                resizable
                                                columnWidth={50}
                                                bg='dark'
                                            >
                                                No
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("productName")}
                                                sortDirection={
                                                    sortConfig.key === "productName" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={150}
                                                bg='dark'
                                            >
                                                ProductName
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("price")}
                                                sortDirection={
                                                    sortConfig.key === "price" ? sortConfig.direction : ""
                                                }
                                                columnWidth={100}
                                                bg='dark'
                                                resizable
                                            >
                                                Price
                                            </Th>
                                            <Th resizable columnWidth={200} bg='dark'> Description</Th>
                                            <Th
                                                onSort={() => handleSort("categoryId")}
                                                sortDirection={
                                                    sortConfig.key === "categoryId" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={120}
                                                bg='dark'
                                            >
                                                Category
                                            </Th>

                                            <Th
                                                onSort={() => handleSort("branchId")}
                                                sortDirection={
                                                    sortConfig.key === "branchId" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={150}
                                                bg='dark'

                                            >
                                                BranchId
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("prepareTime")}
                                                sortDirection={
                                                    sortConfig.key === "prepareTime" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={70}
                                                bg='dark'
                                            >
                                                PrepareTime
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("calories")}
                                                sortDirection={
                                                    sortConfig.key === "calories" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={70}
                                                bg='dark'
                                            >
                                                Calories
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("status")}
                                                sortDirection={
                                                    sortConfig.key === "status" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={100}
                                                bg='dark'

                                            >
                                                Status
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("productOrigin")}
                                                sortDirection={
                                                    sortConfig.key === "productOrigin" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={100}
                                                bg='dark'
                                            >
                                                ProductOrigin
                                            </Th>
                                            <Th
                                                onSort={() => handleSort("sugar")}
                                                sortDirection={
                                                    sortConfig.key === "sugar" ? sortConfig.direction : ""
                                                }
                                                resizable
                                                columnWidth={70}
                                                bg='dark'
                                            >
                                                Sugar
                                            </Th>

                                        </Thead>
                                        <Tbody>
                                            {product.map((item) => (
                                                <tr key={item.id}>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.id}</td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.productName}</td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}> <span className='text-badges-red bold'>{formatCurrency.format(item.price)}</span></td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.description}</td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{findCategoryName(item.categoryId)}</td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}> <span className='text-badges-warning'>{findBranchName(item.branchId)}</span></td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.prepareTime} <span className='text-secondary'>Min</span></td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.calories} </td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{findStatus(item.status)}</td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.productOrigin}</td>
                                                    <td onClick={() => goto(`/item-detail/${item.id}`)}>{item.sugar} <span className='text-secondary'>G</span></td>

                                                </tr>
                                            ))}
                                        </Tbody>
                                    </table>
                                </DataGrid>
                            </div>
                            <div className="row col-md-6 col-12 py-4">
                                <InputValidation
                                    label='Authorize Signature : '
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
        setProduct(searchData(product, searchTerm, ["productName", "productOrigin", "sugar"]));

    }, [searchTerm]);
    function printData() {
        try {
            printDoc('data', 'product_data', userObject().userName, 'Product data');
        } catch (e) {

        }

    }

    function selectPerPage(selected) {
        setRowPerPage(selected.value);
    }
    function exportFile() {
        exportToExcelFiles(product, 'product_data');
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
            removeProductById(id).then((respnse) => {
                getData();
            }).catch(e => {
                alert(e);
            })
        }
    }
    return (
        <>
            <div className='w-100'>
                <Box sx={{ height: '100%', width: '100%', border: 'none', backgroundColor: 'rgb(255,255,255)' }}>
                    <div className='container-fluid p-0'>
                        <ActionHeader
                            btnAddName='New Product'
                            title="Products"
                            subtitle="Manage your product inventory"
                            searchTerm={searchTerm}
                            searchChange={(e) => setSearchTerm(e.target.value)}
                            onCreate={() => navigate('/create-item')}
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
                    <div className=' ps-0  '>
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

                </Box>

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

export default Item
