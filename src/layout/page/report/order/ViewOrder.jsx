
import { useEffect, useState } from 'react';
import '../report.css'
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { listOrder } from '../../../../api/Order';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaFilter, FaPlus, FaPrint, FaSearch } from 'react-icons/fa';
import { Th } from '../../../../components/table/DataGrid';
import { DataGrid } from '@mui/x-data-grid';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { BsArrowRight } from 'react-icons/bs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { exportToExcelFiles, globleCardVariants, globleRowVariants, perPage, searchData } from '../../../../api/AppConfig';
import ActionHeader from '../../../../components/listheader/ActionHeader';
import { Paper } from '@mui/material';
import { getAllBranch } from '../../../../api/Branch';
import { getAllEmployee } from '../../../../api/EmployeeApi';
import { getAllCustomer } from '../../../../api/Customer';
import { hostName } from '../../../../api/host';
import { findCompanyName } from '../../../../api/FindData';
const ViewOrder = () => {
    const [order, setOrder] = useState([]);
    const [product, setProduct] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [branch, setBranch] = useState([]);
    const [employee, setEmployee] = useState([]);
    const domainName = hostName();
    const [productId, setProductId] = useState();
    function getData() {
        getAllBranch().then((respnse) => {
            setBranch(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        })
        getAllCustomer().then((response) => {
            setCustomer(response.data);
        })
    }
    useEffect(() => {
        getOrder()
        getData();
    }, []);
    function getOrder() {
        listOrder().then((response) => {
            setOrder(response.data);
        })
    }
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getOrder();
            return
        }
        setOrder(searchData(order, searchTerm, ["orderDate", "invoiceNumber"]));

    }, [searchTerm]);
    const ExportExcel = (data, fileName) => {
        // 1. Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 2. Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // 3. Write the workbook to an Excel file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = order.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(order.length / rowsPerPage);
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
    function findBranchName(id) {
        try {
            return branch.find(b => b.id == id).branchName;
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



    const columns = [
        { field: 'id', headerName: 'Order ID', type: 'number', width: 120 },
        { field: 'invoiceNumber', headerName: 'Invoice Number', width: 150, renderCell: (params) => params.value || "N/A" },
        {
            field: 'branchId',
            headerName: 'Branch Name',
            width: 180,
            renderCell: (params) => (
                <>
                    {findCompanyName(branch, params.value)}
                </>
            ), // Replace with branch name logic
        },
        {
            field: 'orderType',
            headerName: 'Order Type',
            width: 150,
            renderCell: (params) => (params.value === 1 ? "Dine-in" : "Takeaway"),
        },
        {
            field: 'customerId',
            headerName: 'Customer Name',
            width: 200,
            // Replace with customer name logic
        },
        {
            field: 'acceptedBy',
            headerName: 'Accepted By',
            width: 200,
            renderCell: (params) => (
                <>
                    {findEmployeeIamge(params.value)}
                </>
            ),
        },
        {
            field: 'tableNumber', headerName: 'Order Item.', type: 'number', width: 120, renderCell: (param) =>
                <>

                </>
        },
        {
            field: 'status',
            headerName: 'Order Status',
            width: 150,
            renderCell: (params) =>
                params.value === 1 ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>
                ),
        },
        { field: 'numberOfPeople', headerName: 'Guests', type: 'number', width: 120 },
        { field: 'totalAmount', headerName: 'Total ($)', type: 'number', width: 120 },
        { field: 'cash', headerName: 'Cash Paid ($)', type: 'number', width: 120 },
        { field: 'exchange', headerName: 'Change ($)', type: 'number', width: 120 },
        {
            field: 'orderDate',
            headerName: 'Order Date & Time',
            width: 200,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        { field: 'description', headerName: 'Description', width: 250 },
        {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            width: 150,
            renderCell: (params) =>
                params.value === "COMPLETED" ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>Completed</span>
                ) : (
                    <span style={{ color: 'orange', fontWeight: 'bold' }}>Pending</span>
                ),
        },

    ];


    const navigate = useNavigate();
    const paginationModel = { page: 0, pageSize: 10 };
    const handleRowClick = (params) => {
        // Navigate to a route based on the row's data
        navigate(`/order-detail/${params.row.id}`, { state: { row: params.row } });
    };
    return (
        <>
            <ActionHeader
                btnAddName='New Order'
                title="Order"
                subtitle="View order daily month of all ."
                searchTerm={searchTerm}
                searchChange={(e) => setSearchTerm(e.target.value)}
                // onPrint={() => setIsPrint(true)}
                onExport={() => exportToExcelFiles(order, 'vendor_data')}
                perPage={perPage()}
                selectPerPage={selectPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
            />
            <div className="card border-0">
                <div className="card-body p-0 ">
                    <Paper sx={{ height: '100%', width: '100%' }}>
                        <DataGrid
                            rows={order}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10, 15, 20, 30]}
                            checkboxSelection
                            onRowClick={handleRowClick} // Attach the event

                        />
                    </Paper>
                </div>
            </div>

        </>
    )
}





export default ViewOrder
