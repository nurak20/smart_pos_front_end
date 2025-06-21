import '../report.css'
import { getOrderByID, listOrderLineByOrderID } from '../../../../api/Order'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAllProduct } from '../../../../api/Product'
import { getAllEmployee } from '../../../../api/EmployeeApi'
import { Th } from '../../../../components/table/DataGrid'
import { getAllBranch } from '../../../../api/Branch'
import { format } from 'date-fns';
import Text from '../../../../components/text/Text'
import { Paper } from '@mui/material'
import { hostName } from '../../../../api/host'
const OrderDetail = () => {
    const [invoiceNumber, setInvoiceNumber] = useState(0);
    const [orderType, setOrderType] = useState();
    const [customerId, setCustomerId] = useState();
    const [acceptedBy, setAcceptedBy] = useState();
    const [tableNumber, setTableNumber] = useState();
    const [status, setStatus] = useState();
    const [numberOfPeople, setNumberOfPeople] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [cash, setCash] = useState();
    const [exchange, setExchange] = useState();
    const [orderDate, setOrderDate] = useState("");
    const [description, setDescription] = useState("");
    const [orderLine, setOrderLine] = useState([]);
    const [branchName, setbranchName] = useState('');
    const [branch, setBranch] = useState([]);

    // const [orderID, setOrderID] = useState();
    const { id } = useParams();
    useEffect(() => {
        listOrderLineByOrderID(id).then((response) => {
            setOrderLine(response.data);
        }).catch(error => {
            console.error(error);
        })
        getAllBranch().then((response) => {
            setBranch(response.data);
        }).catch(error => {
            console.error(error);
        })
    }, [])
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    useEffect(() => {
        getOrderByID(id).then((reponse) => {
            setAcceptedBy(reponse.data.acceptedBy);
            setCash(reponse.data.cash);
            setCustomerId(reponse.data.customerId);
            setExchange(reponse.data.exchange);
            setInvoiceNumber(reponse.data.invoiceNumber);
            setDescription(reponse.data.description);
            setOrderDate(reponse.data.orderDate);
            setTotalAmount(reponse.data.totalAmount);
            setOrderType(reponse.data.orderType)
            setbranchName(reponse.data.branchId);
        }).catch(error => {
            console.error(error);
        })
    }, [])
    const [product, setProduct] = useState([]);
    useEffect(() => {
        getAllProduct().then((response) => {
            setProduct(response.data);
        }).catch(e => {
            console.error(e);
        })
    }, [])
    const [employee, setEmployee] = useState([]);
    useEffect(() => {
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        }).catch(e => {
            console.error(e);
        })
    }, [])
    function findProductObj(id) {
        if (!Array.isArray(product)) {
            console.error("The product list is not defined or not an array.");
            return null;
        }

        return product.find(p => p.id === id) || null;
    }

    function findEmployeeName(id) {
        const obj = employee.find(p => p.id == id);
        if (obj) {
            return obj.firstName + " " + obj.lastName;
        } else {
            return "Error name";
        }
    }
    function findBranchName(id) {
        try {
            return branch.find(b => b.id == id).branchName;
        } catch (e) {
            return "No Branch Selected";
        }
    }
    const domainName = hostName();
    const IMG_BEST_URL = `http://${domainName}:8085/api/images/`
    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en', {
                weekday: 'long',   // Full day of the week (e.g., "Monday")
                day: '2-digit',    // Two-digit day (e.g., "07")
                month: 'numeric',  // Numeric month (e.g., "11")
                year: 'numeric',   // Full year (e.g., "2024")
                hour: '2-digit',   // Two-digit hour (e.g., "08")
                minute: '2-digit', // Two-digit minute (e.g., "30")
                second: '2-digit', // Two-digit second (e.g., "15")
                hour12: true       // 12-hour clock (AM/PM)
            }).format(date);
        } catch (e) {
            return "Error Date";
        }
    };

    return (
        <>

            <div className=''>
                <div className="container p-0 center">
                    <div className="row w-100">
                        <div className="col-xl-12">
                            <div className="box-shadow bg-white w-100 rounded">
                                <div className="form-heder w-100 px-4 pt-2" style={{ maxHeight: '100%' }}>
                                    <p className='display-name display-3 py-4'>

                                        <span className='text-center text-secondary'>Order Detail</span> <br />
                                        <p className='fs-1 py-4 text-success'>IVOICE-{invoiceNumber}</p>
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className='d-block text-start fs-6 bg-white px-4 py-2'>
                                            <Text title='Order Type' value={'POS'} fontSize={14} />
                                            <Text title='Customer' value={customerId} fontSize={14} />
                                            <Text title='Company' value={findBranchName(branchName)} fontSize={14} />

                                            <Text title='Seller' value={findEmployeeName(acceptedBy)} fontSize={14} />

                                            <Text title='Description' value={description} fontSize={14} />

                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className='d-block text-start fs-6 bg-white px-4 py-2'>
                                            {/* <div className='group-input center w-100' style={{ fontSize: 14 }}>
                                                <p className='w-25 text-start'>OrderDate ? </p>
                                                <p className='w-75 text-start text-secondary'>{ }</p>
                                            </div> */}
                                            <Text title='Sale Date' value={formatDateTime(orderDate)} fontSize={14} />
                                            <Text title='Total Amount' value={formatCurrency.format(totalAmount)} fontSize={14} />
                                            <Text title='Received' value={formatCurrency.format(cash)} fontSize={14} />
                                            <Text title='Change' value={formatCurrency.format(exchange)} fontSize={14} />

                                        </div>
                                    </div>
                                </div>


                                <div className='bg-white py-3'>
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="text-dark nav-link  active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Order Item</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button class="text-dark nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Note</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button class="text-dark nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#payment-tab-pane" type="button" role="tab" aria-controls="payment-tab-pane" aria-selected="false">Payment</button>
                                        </li>

                                    </ul>
                                    <div class="tab-content border-0" id="myTabContent">
                                        <div class="border-0 tab-pane show active " id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                                            <div className="center w-100">
                                                <div className="card border-0 w-100">
                                                    <div className="card-body p-0 ">
                                                        <table className="">
                                                            <thead valign='middle'>
                                                                <tr>
                                                                    <Th resizable columnWidth={300}>Product</Th>
                                                                    <Th resizable>Qty</Th>
                                                                    <Th resizable>Price</Th>
                                                                    <Th resizable>Amount</Th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {

                                                                    orderLine.map((u, i) =>
                                                                        <tr className="pointer" onClick={() => goto(`/order-detail/${u.id}`)}>
                                                                            <td>
                                                                                <div className="d-flex start">
                                                                                    <Paper sx={{ height: 100, width: 100, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                                                        <img
                                                                                            src={`${IMG_BEST_URL}${findProductObj(u.productId)?.image || "N/A"}`}
                                                                                            alt=""
                                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                                        />
                                                                                    </Paper>
                                                                                    <span className='ps-3 f-16'>{findProductObj(u.productId)?.productName || 'N/A'}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td><span className="f-16">{u.qty}</span></td>
                                                                            <td><span className='f-16'>{formatCurrency.format(u.price)}</span></td>
                                                                            <td><span className="f-16">{formatCurrency.format(u.price * u.qty)}</span></td>



                                                                        </tr>
                                                                    )
                                                                }
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="border-0 tab-pane p-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                                            <p className="text-secondary">New Note</p>
                                        </div>
                                        <div class="border-0 tab-pane p-2" id="payment-tab-pane" role="tabpanel" aria-labelledby="payment-tab" tabindex="0">
                                            <div className='d-block text-start fs-6 bg-white px-4 py-2 w-50'>
                                                <Text title='Sale Date' value={formatDateTime(orderDate)} fontSize={14} />
                                                <Text title='Total Amount' value={formatCurrency.format(totalAmount)} fontSize={14} />
                                                <Text title='Received' value={formatCurrency.format(cash)} fontSize={14} />
                                                <Text title='Change' value={formatCurrency.format(exchange)} fontSize={14} />
                                                <Text title='Payment Status' value={'COMPLETE'} fontSize={14} />

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}





export default OrderDetail
