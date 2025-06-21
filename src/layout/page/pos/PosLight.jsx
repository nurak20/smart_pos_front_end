import { useEffect, useState } from 'react';
import './postest.css'
import PrinInvoice from './PrintInvoice';
import Cookies from 'js-cookie';
import { createOrder, saleItem } from '../../../api/Order';
import { getAllProduct } from '../../../api/Product';
import { format } from 'date-fns';
import { createJournal, createTransaction } from '../../../api/JournalE';
import { getAllCategory } from '../../../api/Category';
import { getAllCustomer } from '../../../api/Customer';
import * as React from 'react';
import Box from '@mui/material/Box';
import ComboBox from '../../../components/select/ComboBox';
import OptionButton from '../../../components/option/OptionButton';
import { json, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getBranchId } from '../../../api/Branch';
import { hostName } from '../../../api/host';
import { getDefualtUserId, globleRowVariants, searchData, userObject } from '../../../api/AppConfig';
import { LiaSearchSolid } from 'react-icons/lia';
import { IoIosAdd, IoIosArrowRoundBack, IoIosPersonAdd } from 'react-icons/io';
import { LuMinus } from 'react-icons/lu';
import { BsPlus } from 'react-icons/bs';
import { HiShoppingCart } from 'react-icons/hi2';
import Text from '../.././../components/text/Text'
import ProductCard from '../../../components/card/ProductCard';
import InputValidation from '../../../components/input/InputValidation';
import { TbShoppingCartX } from 'react-icons/tb';
import Modal from '../../../components/modal/Modal';
import CustomCommoBox from '../../../components/select/CustomCommoBox';
import { motion } from 'framer-motion';
import { Button, duration, Paper } from '@mui/material';
import Calculator from '../../../components/calculator/Calculator';
import { PiCheckCircleLight } from "react-icons/pi";
import { IoMdPersonAdd } from "react-icons/io";
import { getAllBranch } from '../../../api/Branch';
import { findCompanyName } from '../../../api/FindData';
import { IoArrowForwardCircleOutline } from 'react-icons/io5';
import List from '../../../components/list/List';

const PosLight = () => {
    const { id } = useParams();
    const navigate = useNavigate('');
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [categoryId, setCategoryId] = useState();
    const [customer, setCustomer] = useState([]);
    const domainName = hostName();
    const [isPayment, setIsPayment] = useState(false);
    const [numberRememberCustomer, setNumberRememberCustomer] = useState('');
    const [received, setReceived] = useState('');
    const [paymentmethods, setPaymentMethod] = useState();
    const [customerId, setCustomerId] = useState();
    const [paymentSD, setPaymentUSD] = useState();
    const [discounts, setDiscount] = useState();
    const [profile, setProfile] = useState('');
    const [employeeName, setEmployeeName] = useState('No name');
    const [role, setRole] = useState('No role');
    const [branch, setbranch] = useState([]);
    const imageUrl = `http://${domainName}:8085/api/images/`
    const categoryPathImage = `http://${domainName}:8085/api/images/`;
    useEffect(() => {
        try {
            setProfile(userObject().image);
            setRole(userObject().role);
            setEmployeeName(userObject().userName);
        } catch (e) {

        }
    }, [])
    function resetPayment() {
        setPaymentMethod();
        setReceived();
        setCustomerId();
        setPaymentUSD();
    }

    // implement data api
    useEffect(() => {

        getAllProduct().then((respnse) => {
            setProduct(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
        getAllBranch().then((response) => {
            setbranch(response.data);
        })
        getAllCustomer().then((respnse) => {
            setCustomer(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
    }, [id])

    function refrestProduct() {
        getAllProduct().then((respnse) => {
            setProduct(respnse.data);
            console.log(respnse.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function findLengthOfProductByCategory(id) {
        const numberOfProduct = product.filter(p => p.categoryId == id);
        if (numberOfProduct) {
            return numberOfProduct.length;
        }
        return 0;
    }

    useEffect(() => {
        getAllCategory().then((respones) => {
            setCategories(respones.data);
        }).catch(error => {
            console.error(error);
        })
    }, [id])


    // find product name by id
    function findProductName(id) {
        const p = product.find(p => p.id == id);
        if (p) {
            return p.productName
        } else {
            return "Error"
        }
    }
    function findImageProduct(id) {
        const p = product.find(p => p.id == id);
        return p ? imageUrl + p.image : '';
    }
    function setCId(id) {
        setCategoryId(id);
    }
    // product shop 
    function addToCart(productId, qty, price, image) {
        if (id) {
            if (!id) {
                console.error("Table ID is required.");
                return;
            }

            try {
                // Parse existing `table-order` cookie, defaulting to an empty array
                const tableOrders = JSON.parse(Cookies.get("table-order") || '[]');

                // Ensure `tableOrders` is an array
                if (!Array.isArray(tableOrders)) {
                    console.error("Invalid table-order format, resetting to default array.");
                    throw new Error("Invalid table-order format.");
                }

                // Find the table order by `id`
                const tableOrderIndex = tableOrders.findIndex(order => order.id === id);

                if (tableOrderIndex !== -1) {
                    // Access the `data` array for the specific table order
                    const orderData = [...(tableOrders[tableOrderIndex].data || [])];

                    // Check if the item exists in `data`
                    const itemIndex = orderData.findIndex(item => item.productId === productId);

                    if (itemIndex !== -1) {
                        // Increment quantity and update amount if the item exists
                        orderData[itemIndex].qty += qty;
                        orderData[itemIndex].amounts = orderData[itemIndex].qty * price;
                    } else {
                        // Add a new item to the `data` array if it doesn't exist
                        orderData.push({
                            productId,
                            qty,
                            price,
                            amounts: price * qty,
                            image,
                        });
                    }

                    // Update the `data` field in the table order
                    tableOrders[tableOrderIndex] = { ...tableOrders[tableOrderIndex], data: orderData };
                } else {
                    // If table order doesn't exist, create a new one
                    tableOrders.push({
                        id,
                        date: new Date().toISOString(),
                        data: [
                            {
                                productId,
                                qty,
                                price,
                                amounts: price * qty,
                                image,
                            },
                        ],
                    });
                }

                // Save the updated `tableOrders` back to the cookie
                Cookies.set("table-order", JSON.stringify(tableOrders));

                // Refresh the items in the view
                refrestItem();
            } catch (error) {
                console.error("Error updating table order data:", error);
            }

        } else {
            try {

                // Try to parse existing cookie or create an empty array if it doesn't exist
                const defaultObj = JSON.parse(Cookies.get("order") || '[]');
                const item = defaultObj.find(i => i.productId == productId);

                // the same item
                if (item) {
                    // Increment quantity and update amount if item already exists
                    item.qty += qty;
                    item.amounts = item.qty * price;
                } else {
                    // Create a new item to add
                    const obj = { productId, qty, price, amounts: price * qty, image };
                    defaultObj.push(obj);
                    console.log(obj);
                }

                // Set the updated array back to the cookie
                Cookies.set("order", JSON.stringify(defaultObj));
                // Refresh item if function is defined
                refrestItem();

            } catch (error) {
                // If there was an error, initialize with a new array containing the new item
                const obj = { productId, qty, price, amounts: price * qty, image };

                Cookies.set("order", JSON.stringify([obj]));
                console.log(obj);
                // Refresh item if function is defined

            }
        }
        totalPayment();

    }

    const [errorOrder, setErrorsOrder] = useState([]);
    function orderValidation() {
        const newErrors = {};

        if (discounts) {
            if (!(received >= paymentSD)) {
                newErrors.received = 'Cash received is small than Total payment ! after discount' + discounts + '%'
            }

        }
        if (!discounts) {
            if (!(received >= totalPay)) {
                newErrors.received = 'Cash received is small than Total payment !'
            }
        }
        if (!received) {
            newErrors.received = 'Enter Cash received from customer first !'
        }
        const user = getDefualtUserId();
        if (!user) {
            Cookies.remove("user-data");
            window.location.reload();
            newErrors.user = 'Enter Cash received from customer first !'
        }
        if (!userObject().branch) {
            newErrors.branch = 'Branch Is Can not null'
        }
        setErrorsOrder(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    // order item or hold order
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [transactionData, setTransactionData] = useState(null);
    function order() {
        try {
            if (!orderValidation()) {
                return
            }
            const branchId = userObject().branch;
            const user = getDefualtUserId();
            let item = [];
            if (id) {
                const orderTables = JSON.parse(Cookies.get("table-order") || '[]');
                if (!Array.isArray(orderTables)) return;
                const objOrderTable = orderTables.find(o => o.id == id);
                item = objOrderTable.data;
                if (!item) return
            } else {
                item = JSON.parse(Cookies.get("order") || '[]');
                if (!item) return
            }



            const totalAmount = discounts ? paymentSD : totalPay;
            const objOrder = {
                "branchId": branchId ? branchId : 0,
                "orderType": 1,
                "customerId": customerId ? customerId : 0,
                "acceptedBy": user ? user : 0,
                "tableNumber": null,
                "status": 1,
                "numberOfPeople": 4,
                "totalAmount": totalAmount,
                "totalDiscount": discounts ? (discounts / 100) * totalPay : 0,
                "cash": received,
                "exchange": received - totalAmount,
                "orderDate": new Date(),
                "description": "Order for table 5, including fast food items.",
                "orderLines": item
            }
            saleItem(objOrder).then((response) => {
                console.log(response.data);

                const objJournal = {
                    "journal": 'POS',
                    "branchId": branchId ? branchId : 0,
                    "partnerId": null,
                    "date": new Date(),
                    "total": totalAmount,
                    "reference": "POS SALE INV-" + response.data.invoiceNumber,
                    "status": "1"
                }
                createJournal(objJournal).then((reponseJ) => {
                    console.log(reponseJ.data);
                    const objTransaction = {
                        "journalEntriesId": reponseJ.data.id,
                        "accountId": 21,
                        "label": "POS Sale Revenues",
                        "debit": totalAmount,
                        "credit": null,
                    }

                    createTransaction(objTransaction).then((responseT) => {
                        console.log(responseT.data);
                    }).catch(error => {
                        console.error(error);
                    })
                    const objTransaction2 = {
                        "journalEntriesId": reponseJ.data.id,
                        "accountId": 12,
                        "label": "POS Sale Revenues",
                        "debit": null,
                        "credit": totalAmount
                    }
                    createTransaction(objTransaction2).then((responseT) => {
                        console.log(responseT.data);
                    }).catch(error => {
                        console.error(error);
                    })
                    setReceived('');
                    setIsPayment(false);
                    setIsPaymentSuccess(true);
                    // complete transaction
                    completeTransaction(response.data);
                    if (id) {
                        const orderTables = JSON.parse(Cookies.get("table-order") || '[]'); // Default to empty array
                        console.log(orderTables);

                        // Check if `orderTables` is an array
                        if (Array.isArray(orderTables)) {
                            const refreshData = orderTables.filter(o => o.id != id);
                            Cookies.set("table-order", JSON.stringify(refreshData));
                        } else {
                            console.error("table-order is not an array:", orderTables);
                            setOrder([]); // Reset to an empty array
                        }
                    } else {
                        Cookies.remove("order");
                    }

                    resetPayment()
                    refrestItem();
                }).catch(error => {
                    console.error(error);
                })
                refrestItem();
            }).catch(error => {
                Cookies.remove('user-data');
                window.location.href = '/'
            })


        } catch (error) {

        }
    }
    const completeTransaction = (data) => {
        setTransactionData(data);
    };
    // save table order on memmory web browser
    function saveTableOrder() {
        if (!validation()) return
        if (!id) {
            try {
                // Parse the 'order' cookie and initialize the 'table-order' array
                const orderData = JSON.parse(Cookies.get('order') || '[]'); // Get the current order
                if (!orderData) {
                    return
                }
                let orderTables;

                // Safely parse the 'table-order' cookie or initialize it as an array
                try {
                    orderTables = JSON.parse(Cookies.get('table-order') || '[]');
                    if (!Array.isArray(orderTables)) {
                        console.warn("table-order is not an array. Reinitializing it as an array.");
                        orderTables = []; // Reset as an array if it's not one
                    }
                } catch (e) {
                    console.warn("Error parsing table-order cookie. Initializing as empty array.", e);
                    orderTables = []; // Reset as an array on error
                }

                // get all hold order for checking if duplicate

                const obj = {
                    id: numberRememberCustomer.trim(), // Ensure clean input
                    date: new Date(),
                    data: orderData,
                    branch: userObject().branch
                };

                if (!obj) {
                    return
                }
                // Add the new order to the array
                orderTables.push(obj);

                // Save the updated 'table-order' back to cookies
                Cookies.set('table-order', JSON.stringify(orderTables));
                alert(JSON.stringify(orderTables, null, 2))
                console.log(orderTables);

                // Cleanup after saving
                Cookies.remove("order"); // Remove the 'order' cookie
                setItemOrder([]); // Reset order state
                setNumberRememberCustomer('') // Clear the input field
                totalPayment();
            } catch (e) {
                console.error("Error in saveTableOrder:", e);
            }
        } else {
            alert('table is already save')
        }

    }

    // find total payment using array object of customer order
    function totalPayment() {
        let item;

        if (id) {
            const orderTables = JSON.parse(Cookies.get("table-order") || '[]');
            if (!Array.isArray(orderTables)) return
            const objOrderTable = orderTables.find(o => o.id == id);
            item = objOrderTable.data;
            if (!item) return
        } else {
            item = JSON.parse(Cookies.get("order") || '[]');
        }
        setItemOrder(item);
        if (item.length == 0) {
            setPaymentUSD(0);
            setTotalPay(0)
            return;
        }
        let total = 0;
        if (item) {
            for (let i = 0; i < item.length; i++) {
                total += item[i].price * item[i].qty; // Calculate item total
            }
        }
        setTotalPay(total);
        if (discounts) {
            const totalPay = total - total * discounts / 100;
            setPaymentUSD(totalPay);
        }
    }
    // if id is change refrest new total payment
    useEffect(() => {
        totalPayment();
    }, [id])

    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const [itemOrder, setItemOrder] = useState([])
    function refrestItem() {
        try {
            // user use check on hold order we need to get order-data to sale item

            if (id) {
                const orderTables = JSON.parse(Cookies.get("table-order") || '[]'); // Default to empty array
                // check if this object not array
                if (!Array.isArray(orderTables)) return

                const objOrderTable = orderTables.find(o => o.id == id);
                setItemOrder(objOrderTable.data);

                // if we need display number of table order
                setNumberRememberCustomer(objOrderTable.id)

            } else {
                const item = JSON.parse(Cookies.get("order") || '[]');
                if (item) {
                    setItemOrder(item);
                    totalPayment();
                }
            }
        } catch (error) {
            setItemOrder([]);
            totalPayment();
            setNumberRememberCustomer('');
        }
    }
    useEffect(() => {
        refrestItem();
    }, [id])
    const [totalPay, setTotalPay] = useState(0);

    function updateQty(btn, pid) {
        if (id) {
            // user click on button plus + item
            if (btn === 1) {
                try {
                    const tableOrders = JSON.parse(Cookies.get("table-order") || '[]'); // Parse as array
                    const tableOrderIndex = tableOrders.findIndex(order => order.id === numberRememberCustomer); // Find the specific table order
                    if (tableOrderIndex === -1) throw new Error("Table order not found");

                    const items = tableOrders[tableOrderIndex].data || []; // Access the `data` array safely
                    const updatedItems = items.map(item =>
                        item.productId === pid
                            ? { ...item, qty: item.qty + 1, amounts: (item.qty + 1) * item.price }
                            : item
                    );

                    // Update the specific table order in the array
                    tableOrders[tableOrderIndex] = { ...tableOrders[tableOrderIndex], data: updatedItems };

                    // Save back the updated `table-order` array
                    Cookies.set("table-order", JSON.stringify(tableOrders));

                    refrestItem(); // Refresh the view
                } catch (error) {
                    console.error("Error incrementing item quantity:", error);
                    refrestItem();
                }
            } else {
                try {
                    const tableOrders = JSON.parse(Cookies.get("table-order") || '[]'); // Parse as array
                    const tableOrderIndex = tableOrders.findIndex(order => order.id === numberRememberCustomer); // Find the specific table order
                    if (tableOrderIndex === -1) throw new Error("Table order not found");

                    const items = tableOrders[tableOrderIndex].data || []; // Access the `data` array safely
                    const updatedItems = items
                        .map(item =>
                            item.productId === pid
                                ? { ...item, qty: item.qty - 1, amounts: (item.qty - 1) * item.price }
                                : item
                        )
                        .filter(item => item.qty > 0); // Remove items with `qty` <= 0

                    // Update the specific table order in the array
                    tableOrders[tableOrderIndex] = { ...tableOrders[tableOrderIndex], data: updatedItems };

                    // Save back the updated `table-order` array
                    Cookies.set("table-order", JSON.stringify(tableOrders));

                    refrestItem(); // Refresh the view
                } catch (error) {
                    console.error("Error decrementing item quantity:", error);
                    refrestItem();
                }
            }
        } else {
            if (btn == 1) {
                try {
                    const item = JSON.parse(Cookies.get("order") || '[]');
                    const findItem = item.find(i => i.productId == pid);
                    findItem.qty += 1;
                    findItem.amounts = findItem.qty * findItem.price;
                    Cookies.set("order", JSON.stringify(item));
                    refrestItem();

                } catch (error) {
                    refrestItem();
                }
            } else {
                try {
                    const item = JSON.parse(Cookies.get("order") || '[]');
                    const findItem = item.find(i => i.productId == pid);
                    if (findItem.qty == 1) {
                        const newItem = item.filter(i => i.productId != pid);
                        Cookies.set("order", JSON.stringify(newItem));
                    } else {
                        findItem.qty -= 1;
                        findItem.amounts = findItem.qty * findItem.price;
                        Cookies.set("order", JSON.stringify(item));

                    }
                    refrestItem();


                } catch (error) {
                    refrestItem();
                }
            }
        }
        totalPayment();
    }

    function listTable() {
        return (
            <div className="card border-0 bg-none">
                <div className="card-body p-0 border-0 bg-none ps-2" style={{
                    overflow: 'scroll', scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none',
                }}>
                    <table className="text-dark w-100" style={{ fontSize: '12px', minWidth: '450px' }}>
                        <thead valign='middle '>
                            <tr className='border-secondary border-bottom'>

                                <td className='py-3'>No</td>
                                <td style={{ width: '250px' }}>Item</td>
                                <td>Price</td>
                                <td>Qty</td>
                                <td>Amount</td>
                                <td>Action</td>



                            </tr>
                        </thead>
                        <tbody>
                            {
                                itemOrder.map((f, i) =>
                                    <motion.tr
                                        key={i}
                                        custom={i} // Pass index for staggered animation
                                        variants={globleRowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="pointer" onClick={() => goto(`/item-detail`)}>

                                        <td className='py-3'>{i + 1}</td>
                                        <td>
                                            <div className="start">
                                                <div className="center" style={{ height: '70px' }}>
                                                    <img src={findImageProduct(f.productId)} className='h-100 rounded ' alt="" />
                                                </div>
                                                <div className='ps-2'>
                                                    {findProductName(f.productId)}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatCurrency.format(f.price)}</td>
                                        <td>{f.qty}</td>
                                        <td>{formatCurrency.format(f.amounts)}</td>
                                        <td>
                                            <div className='font-12'>
                                                <button className='btn font-12  small-i box-shadow' onClick={() => updateQty(2, f.productId)}>-</button>
                                                <span className='bg-none small-i mx-1 text-dark'>{f.qty}</span>
                                                <button className='btn font-12 small-i box-shadow' onClick={() => updateQty(1, f.productId)}>+</button>

                                            </div>
                                        </td>



                                    </motion.tr>
                                )
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }
    function setValueFromCalculae(value) {
        if (isPayment) {
            setReceived(value);
            return
        }
        setNumberRememberCustomer(value);
    }

    const [errors, setErrors] = useState([]);
    function validation() {
        const newErrors = {}
        if (!itemOrder.length) {
            newErrors.item = 'No item on shop'
        }
        if (!numberRememberCustomer) {
            newErrors.numberRememberCustomer = 'Table number is require'
        }
        try {
            const holdOrderObject = JSON.parse(Cookies.get('table-order') || '[]');
            if (Array.isArray(holdOrderObject)) {
                const filterHolderBranch = holdOrderObject.filter(f => f.branch == userObject().branch);
                const isDubplicate = filterHolderBranch.find(i => i.id == numberRememberCustomer);
                if ((isDubplicate)) {
                    newErrors.numberRememberCustomer = 'Table number is already exists in this branch'
                }
            }
        } catch (e) {

        }
        if (!userObject().branch) newErrors.branch = 'Branch number is require'
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // payment
    function payment() {
        return (
            <>
                <div className="">
                    <div className="row">
                        <div className="col-xl-8 col-lg-6 col-12 col-md-6 col-12 d-block">
                            <div className='container-fluid w-100 mt-5' style={{ maxWidth: '900px' }}>
                                <div className='display-6 text-badges-green text-center'>Total Payment :  {paymentSD ? formatCurrency.format(paymentSD) : formatCurrency.format(totalPay)}</div>
                                {listTable()}


                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-12">
                            <div className='bg-none p-3' style={{ height: '100vh' }}>
                                <div className="bg-none rounded h-100 box-shadow" style={{ position: 'relative', overflow: 'scroll' }}>

                                    <div className="h-50 p-3">
                                        {/* <ComboBox
                                            options={customer}
                                            className='border-0 border-bottom mb-2'
                                            onSelect={selectCustomer}
                                            labelKeys={["firstName", "lastName"]}
                                            inputClassName='border-0 bg-none ps-0'
                                            optionClassName='hover-line'
                                        /> */}
                                        {/* <CustomCommoBox
                                            fontSize={16}
                                            label='Select customer'
                                            items={customer}
                                            onItemSelected={selectCustomer}
                                            labelKeys={["firstName", "lastName"]}
                                            searchKey={"firstName"}
                                        /> */}
                                        {customerId ? <p className='fs-5 display-name py-3 text-success'>Customer {customerId ? customer.find(c => c.id == customerId).firstName + ' ' + customer.find(c => c.id == customerId).lastName : 'No Customer'}</p> : null}
                                        <Button variant='contained' startIcon={<IoIosPersonAdd className='fs-3' />} className='py-3 mb-3 w-100 fs-5 center' data-bs-toggle="modal" data-bs-target="#modalCustomer">
                                            Customer
                                        </Button>
                                        <CustomCommoBox
                                            fontSize={16}
                                            label='Select payment method'
                                            items={paymentmethod}
                                            defaultValueIndex={paymentmethod.findIndex(p => p.value == paymentmethods)}
                                            onItemSelected={(select) => setPaymentMethod(select?.value)}
                                            labelKeys={["text"]}
                                            searchKey={"text"}
                                        />
                                        <CustomCommoBox
                                            fontSize={16}
                                            label='Select discount'
                                            items={discount}
                                            defaultValueIndex={discount.findIndex(d => d.value == discounts)}
                                            onItemSelected={(select) => {
                                                const total = totalPay - totalPay * select?.value / 100;
                                                setPaymentUSD(total);
                                                setDiscount(select?.value)
                                            }}
                                            labelKeys={["label"]}
                                            searchKey="label"
                                        />

                                    </div>

                                    <div className="h-50 ">
                                        <div className="position-absolute bottom-0 w-100 px-3 pb-3">
                                            <InputValidation
                                                label='DISCOUNT USD'
                                                id='discount'
                                                type='number'
                                                fontSize={16}

                                                value={discounts ? totalPay * discounts / 100 : 0}

                                            />
                                            <InputValidation
                                                label='EXCHANGE USD'
                                                id='exchange'

                                                type='number'
                                                fontSize={16}

                                                value={discounts ? (received - paymentSD > 0 ? received - paymentSD : 0) : received - totalPay > 0 ? received - totalPay : 0}

                                            />
                                            {/* <span className='text-danger'>{errorOrder.payment ? errorOrder.payment : ''}</span> */}

                                            <div className=''>
                                                <Calculator onInputChange={(value) => setReceived(value)} value={received} placeholder='Enter Received' />
                                            </div>
                                            <div className="row py-2">
                                                <div className='col-4 pe-1'>

                                                    <Button variant='contained' color='error' className='h-100 w-100 py-4' onClick={() => {
                                                        setIsPayment(false)
                                                    }} >
                                                        Back
                                                    </Button>
                                                </div>
                                                <div className="col-8">

                                                    {/* {received >= totalPay ? <Button variant='contained' startIcon={<PiCheckCircleLight />} color='success' className='h-100 w-100 py-4' onClick={() => order()}>
                                                        Complete
                                                    </Button> : ''} */}
                                                    {received >= (discounts ? paymentSD : totalPay) && itemOrder.length > 0 ?
                                                        <Button variant='contained' startIcon={<PiCheckCircleLight />} color='success' className='h-100 w-100 py-4' onClick={() => order()}>
                                                            Complete
                                                        </Button> :
                                                        <Button variant='contained' startIcon={<PiCheckCircleLight />} color='success' className='h-100 w-100 py-4' disabled>
                                                            Complete
                                                        </Button>
                                                    }
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



    const discount = [
        { id: 1, label: "Discount 0%", value: 0 },
        { id: 2, label: "Discount 25%", value: 25 },
        { id: 3, label: "Discount 40%", value: 40 },
        { id: 4, label: "Discount 50%", value: 50 },
        { id: 5, label: "Discount 75%", value: 75 },
    ];
    const paymentmethod = [
        { id: 1, text: "CASH", value: 'CASH' },
        { id: 2, text: "Kh QR", value: 'KH QR' },
    ];
    // action staff
    function staffAction() {
        return (
            <>
                <div className='h-40'>
                    <div className='position-absolute bottom-0 w-100 px-3'>
                        <div className="d-flex justify-content-between align-items-center text-dark   w-100">
                            <div className='w-100 start text-secondary f-16 display-name'>Total USD :</div>
                            <div className='bold text-badges-green display-name'>{formatCurrency.format(totalPay)}</div>

                        </div>

                        {errors.numberRememberCustomer ? <div className='f-12'></div> : ''}

                        <div className='row mt-1 p-2 rounded px-0'>

                            <div className='col-12 pe-0'>
                                <Calculator onInputChange={(e) => setNumberRememberCustomer(e)} value={numberRememberCustomer} />
                            </div>
                            <div className="col-6 pe-0 py-2 pb-1">

                                {numberRememberCustomer != '' ?
                                    <Button variant='contained' color='success' className="h-100 w-100 py-3"
                                        onClick={() => saveTableOrder()}
                                    >
                                        <i class="fa-solid fa-utensils"></i>
                                        <span className='ps-2'>Hold Order</span>
                                    </Button> :
                                    <Button variant='contained' color='success' className="h-100 w-100 py-3" disabled >
                                        <i class="fa-solid fa-utensils"></i>
                                        <span className='ps-2'>Hold Order</span>
                                    </Button>
                                }

                            </div>
                            <div className="col-6 pe-0  py-2 pb-1">
                                {itemOrder.length ? (
                                    <>
                                        <Button variant='contained' color='success' className=" w-100 h-100 p-3"
                                            onClick={() => {
                                                setIsPayment(true);
                                            }}
                                        >
                                            <i class="fa-solid fa-arrow-right pe-2"></i> Payment
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant='contained' color='success' className="w-100 h-100 py-3" disabled>
                                            <i class="fa-solid fa-arrow-right pe-2"></i> Payment
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function customerModal() {
        return (
            <>
                <div className="modal animation-opacity" id="modalCustomer" tabindex="-1" aria-labelledby="modalCustomerModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{customerId ? customer.find(c => c.id == customerId).firstName + ' ' + customer.find(c => c.id == customerId).lastName : 'No Customer Selected'}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <Paper className="modal-body" sx={{ width: '100%', maxHeight: '600px', overflowY: 'scroll' }}>
                                {
                                    customer.map(c =>
                                        <div onClick={() => setCustomerId(c.id)}
                                            style={{
                                                background: c.id == customerId ? 'rgb(246, 246, 246)' : ''
                                            }}>
                                            <List imgUrl={c.image} title={c.firstName + ' ' + c.lastName} subTitle={c.phoneNumber} />
                                        </div>
                                    )
                                }
                            </Paper>
                            <div class="modal-footer">
                                <Button variant='contained' color='error' data-bs-dismiss="modal" className='py-2' onClick={() => setCustomerId()}>discard</Button>
                                <Button variant='contained' color='primary' className='ms-1 py-2' data-bs-dismiss="modal">Save changes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            refrestProduct();
            return
        }
        setProduct(searchData(product, searchTerm, ["productName", "productOrigin"]));

    }, [searchTerm]);

    const rowVariants = {
        hidden: { opacity: 0, Y: 10 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.03,
                duration: 0.5,
                ease: 'easeOut',
            },
        }),
    };

    return (
        <>
            <div className="d-flex pos">
                <div className="pos-info w-100 d-flex rounded bg-white" style={{
                    height: '100vh',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none',
                }}>
                    <div className='w-100 px-2 h-100'>
                        <div
                            className='d-flex justify-content-between align-items-center my-2 px-2 py-2 rounded box-shadow border'
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',
                                // boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                            }}
                        >
                            {/* <div className='w-100 d-flex justify-content-between align-items-center px-3 pe-1' style={{ maxWidth: '400px' }}>
                                <LiaSearchSolid className='f-20 pointer' /><input type="text" className='ms-2 w-100 border rounded p-2 px-3' placeholder='search' />
                            </div> */}

                            <div>
                                <p className='f-16 px-3 border-3 border-start'>Company's {findCompanyName(branch, userObject().branch)} </p>
                            </div>
                            <div className='start text-start pe-3'>

                                <p className="center rounded-circle box-shadow p-1 border borde-success" style={{ height: '60px', width: '60px', overflow: 'hidden' }}>
                                    <img src={`${imageUrl}${profile}`} alt="" className='h-100 rounded-circle' />
                                </p>
                                <p className='f-14 ps-2 d-block mt-1'>
                                    <p className='text-dark'>{employeeName}</p>
                                    <p className='f-10 text-secondary' style={{ opacity: '0.8' }}>{role}</p>
                                </p>

                            </div>


                        </div>

                        <div className='px-2 h-100 rounded'>
                            <div className='d-flex justify-content-between align-items-center my-2 py-1 pt-2 '>
                                <p className="text-start d-block">
                                    <div className='ps-3 f-20 border-start'>Category</div>
                                    <div className='f-10 text-secondary border-start ps-3 '>select food categroy</div>

                                </p>

                                <div className='w-100 d-flex justify-content-between align-items-center px-3 pe-0' style={{ maxWidth: '400px' }}>
                                    <LiaSearchSolid className='f-20 pointer' />
                                    <input type="text" className='ms-2 w-100 border rounded p-2 px-3' placeholder='search'
                                        onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div className="w-100 mt-1 d-flex py-1 pt-0" style={{
                                overflowX: 'scroll',
                                scrollbarWidth: 'none', // For Firefox
                                msOverflowStyle: 'none',
                            }}>
                                <div className="center">
                                    <Paper

                                        // style={{ color: `${colorChange}`, background: `${bgChange}` }}
                                        className={`pointer button-pos-category category me-1 ${activeIndex === 0 ? "button-pos-category active-category" : ""
                                            }`}

                                        onClick={() => {
                                            setActiveIndex(0)
                                            setCId(null)
                                        }} // Update active index on click
                                    >
                                        <div className="" style={{ height: '40px', overflow: 'hidden' }}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/737/737967.png " className='h-100' alt="" />
                                        </div>
                                        <div className='py-2 ps-3 d-block text-start'>
                                            <div className="f-16">
                                                All Category
                                            </div>
                                            <div className='f-10'>
                                                {product ? product.length : 0} Item
                                            </div>
                                        </div>

                                    </Paper>
                                </div>
                                {
                                    categories.map((c, index) =>
                                        <motion.div
                                            key={c.id}
                                            custom={index} // Pass index for staggered animation
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="center">
                                            <Paper
                                                elevation={1}
                                                key={c.id}
                                                // style={{ color: `${colorChange}`, background: `${bgChange}` }}
                                                className={`pointer button-pos-category category  me-1 ${activeIndex === index + 1 ? "button-pos-category active-category" : ""
                                                    }`}

                                                onClick={() => {
                                                    setActiveIndex(index + 1)
                                                    setCId(c.id)
                                                }} // Update active index on click
                                            >
                                                <div className='' style={{ height: '40px', overflow: 'hidden' }}>
                                                    <img src={`${categoryPathImage}${c.image}`} alt="" className='h-100' />
                                                </div>
                                                <div className='py-2 ps-3 d-block text-start'>
                                                    <div className="f-16">
                                                        {c.name}

                                                    </div>
                                                    <div className='f-10'>
                                                        {findLengthOfProductByCategory(c.id)} Item
                                                    </div>
                                                </div>

                                            </Paper>
                                        </motion.div>
                                    )
                                }


                            </div>
                            <div className='row py-2'>
                                {
                                    product.map((p, index) => {
                                        if (p.categoryId == categoryId) {
                                            return (
                                                <>
                                                    <motion.div
                                                        key={p.id}
                                                        custom={index} // Pass index for staggered animation
                                                        variants={rowVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                                                        <div

                                                        >
                                                            <ProductCard
                                                                image={p.image}
                                                                price={p.price}
                                                                name={p.productName}
                                                                onClick={() => addToCart(p.id, 1, p.price, p.image)}
                                                            />

                                                        </div>

                                                    </motion.div>
                                                </>
                                            )
                                        } else if (categoryId == null) {
                                            return (
                                                <>
                                                    <motion.div
                                                        key={p.id}
                                                        custom={index} // Pass index for staggered animation
                                                        variants={rowVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                                                        <div

                                                        >
                                                            <ProductCard
                                                                image={p.image}
                                                                price={p.price}
                                                                name={p.productName}
                                                                onClick={() => addToCart(p.id, 1, p.price, p.image)}
                                                            />

                                                        </div>

                                                    </motion.div>
                                                </>
                                            )
                                        }
                                    }
                                    )
                                }
                            </div>
                        </div>

                    </div >

                </div >
                <div className="d-block d-xl-none fixed-bottom border border-secondary rounded-0 bg-white">

                    <button class="btn-pay w-100 rounded-0 py-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">{formatCurrency.format(totalPay)}</button>
                </div>
                <div className='pos-view-order p-0  d-none d-xl-block bg-light p-1 rounded'>
                    <div className="border-0 h-100 bg-white box-shadow" style={{
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none', // For Firefox
                        msOverflowStyle: 'none',
                        position: 'relative'
                    }}>

                        <div className={id ? 'h-90 px-2' : 'px-2 h-60'} style={{
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            scrollbarWidth: 'none', // For Firefox
                            msOverflowStyle: 'none',
                        }}>
                            {
                                itemOrder.length > 0 ? itemOrder.map((i, index) =>
                                    <>
                                        <motion.div
                                            key={index}
                                            custom={index} // Pass index for staggered animation
                                            variants={globleRowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="w-100 border-0 border-bottom border-secondary"
                                            style={{ height: '110px' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center border-0 w-100">
                                                <div className="w-25 center">
                                                    <div
                                                        className="rounded-circle center  shadow"
                                                        style={{ height: '90px', width: '90px', overflow: 'hidden' }}
                                                    >
                                                        <img
                                                            src={`${imageUrl}${i.image}`}
                                                            alt=""
                                                            className="h-100 "
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ps-2 w-75" style={{ maxWidth: '100%' }}>
                                                    <div className="w-100">
                                                        <div className="d-flex justify-content-between align-items-center" style={{ height: '50px' }}>
                                                            <span className="font-14 text-truncate w-100">{findProductName(i.productId)}</span>
                                                            {/* Uncomment and style if needed */}
                                                            {/* <i className="fa-solid fa-trash pointer"></i> */}
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center" style={{ height: '50px' }}>
                                                            <div className="w-100">
                                                                <span className="fs-5 text-badges-red">{formatCurrency.format(i.price)}</span>
                                                                <span className="font-12 ps-2"> / unit</span>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <span
                                                                    className="small-i text-badges-danger box-shadow me-2 pointer"
                                                                    onClick={() => updateQty(2, i.productId)}
                                                                >
                                                                    <LuMinus />
                                                                </span>
                                                                <span className="bg-none text-dark text-badges-danger mx-2">{i.qty}</span>
                                                                <span
                                                                    className="small-i text-badges-green box-shadow ms-2 pointer"
                                                                    onClick={() => updateQty(1, i.productId)}
                                                                >
                                                                    <IoIosAdd />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                    </>
                                ) : (
                                    <>
                                        <div className='h-100 w-100 center'>
                                            <div className='d-block text-center fs-1'>
                                                <TbShoppingCartX />
                                                <div className='fs-4'>{errors.item ? (<span className='text-danger'>{errors.item}</span>) : (<>No Item</>)}</div>
                                            </div>

                                        </div>
                                    </>
                                )

                            }
                        </div>

                        {id ? (
                            <>
                                <div className='h-10'>
                                    <div className='position-absolute bottom-0 w-100 px-3 pb-3'>
                                        <p className="fs-3 display-name text-center py-3">TOTAL : {formatCurrency.format(totalPay)}</p>
                                        <Button variant='contained' color='success' className='w-100 py-3 h-100' onClick={() => setIsPayment(true)}><span className='pe-2'>Payment</span> <IoArrowForwardCircleOutline className='fs-5' /></Button>
                                    </div>
                                </div>
                            </>
                        ) : staffAction()}

                    </div>
                </div>


            </div >



            {/* Customer modal selected  */}
            {customerModal()}
            {/* Invoice  */}
            <div className="modal fade " id="printer" tabindex="-1" aria-labelledby="printer" aria-hidden="true" >
                <div class="modal-dialog bg-none">
                    <div class="modal-content bg-none">

                        <div class="modal-body bg-none">
                            <PrinInvoice />
                        </div>

                    </div>
                </div>
            </div>

            {/* </div > */}
            <div className="modal slideInLeft " id="numberOfTable" tabindex="-1" aria-labelledby="numberOfTable" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg bg-none">
                    <div class="modal-content bg-white">
                        <div class="modal-header between border-secondary">
                            <h1 class="modal-title fs-5 start text-des w-75" id="exampleModalLabel">
                                <label htmlFor="tableNum" className='f-16 txt-label' >Enter Table Number :</label> <br />
                            </h1>
                            <button type="button" class="text-des btn " data-bs-dismiss="modal" aria-label="Close">
                                <i class="fa-solid fa-xmark text-des fs-3"></i>
                            </button>
                        </div>
                        <div class="modal-body d-flex justify-content-center">
                            <div className='mb-1 w-100'>

                                <input type="text" id='tableNum' className='bg-none py-3 px-3 text-dark w-100 px-0 text-box' placeholder='enter cash received' value={numberRememberCustomer} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="modal slideInLeft " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen bg-none">
                    <div class="modal-content bg-blur-light">
                        <div class="modal-header between border-secondary">
                            <h1 class="modal-title fs-5 start text-des w-75" id="exampleModalLabel">Setting</h1>
                            <button type="button" class="text-des btn " data-bs-dismiss="modal" aria-label="Close">
                                <i class="fa-solid fa-xmark text-des fs-3"></i>
                            </button>
                        </div>
                        <div class="modal-body d-flex justify-content-center mt-5">
                            <div className="d-block text-light">
                                <form action="" className='' style={{ width: '500px', maxWidth: '700px' }}>
                                    <div className='fs-4 border-secondary input-box w-100 pointer' onClick={() => {
                                        Cookies.set("mode", 1);
                                        location.reload();
                                    }}>
                                        <input type="radio" name="mode" className='pointer' id="dark" value="light" style={{ width: '20px', height: '20px' }} />
                                        <label htmlFor="dark" className='px-3  text-dark   w-75 pointer'>Dark Mode</label>
                                    </div>
                                    <div className='fs-4 border-secondary input-box w-100 mt-2 pointer'
                                        onClick={() => {
                                            Cookies.set("mode", 2);
                                            location.reload();
                                        }}>
                                        <input type="radio" className='pointer' name="mode" id="light" value="light" style={{ width: '20px', height: '20px' }} />
                                        <label htmlFor="light" className='px-3 w-75 text-dark pointer'>Light Mode</label>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* // Payment  */}
            <Modal isOpen={isPayment} children={payment()} />
            {/* <Modal isOpen={isPayment} children={receivedData ? <PrinInvoice invoiceData={receivedData} /> : ''} /> */}
            {/* {transactionData && transactionData.paymentStatus == 'COMPLETED' && (
                
            )} */}
            <Modal isOpen={isPaymentSuccess} children={<PrinInvoice invoiceData={transactionData} onClick={() => {
                setTransactionData(null)
                setIsPaymentSuccess(false)
                if (id) {
                    navigate("/order-history")
                }

            }} />} />

            {/* <div className="offcanvas offcanvas-start w-100" tabindex="-1" id="payment" aria-labelledby="payment">
                <div className="offcanvas-body p-0">

                </div>
            </div> */}
            <div className="offcanvas offcanvas-start w-100" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasBottomLabel">View order</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body w-100 px-1">
                    <div className="between text-dark  fs-4 py-3">
                        <div className='w-100 start fs-5'>Total Payment :</div>
                        <div className='text-dark fw-bold'>{formatCurrency.format(totalPay)}</div>
                    </div>
                    <div className="button-grid">
                        <button className='btn-grid'><i class="fa-solid fa-user-plus pe-2"></i> Customer </button>
                        <button className='btn-grid'><i class="fa-solid fa-cart-shopping pe-2"></i> Order Table</button>
                        <button className='bg-orange btn-grid'>
                            <input type="text" className='border-0 bg-none h-100 w-100' placeholder='Enter number of table' value={numberRememberCustomer} />
                        </button>
                        <button className='btn-grid'><i class="fa-solid fa-circle-info pe-2"></i> Enter Code</button>
                    </div>

                    <div className='d-flex mt-1'>
                        <div style={{ height: '100%' }}>
                            <Calculator onInputChange={setValueFromCalculae} value={numberRememberCustomer} />
                        </div>
                        <div className="d-block w-100">
                            <button className="btn-silver rounded-0 h-25 border box-shadow w-100 d-block fs-6"
                                data-bs-toggle="offcanvas" data-bs-target="#payment" aria-controls="payment"
                                onClick={() => {
                                    setIsPayment(true);
                                }}
                            >
                                <i class="fa-solid fa-arrow-right pe-2"></i> Payment
                            </button>
                            <button className="btn-order rounded-0 h-75  text-white box-shadow w-100 d-block fs-6"
                                onClick={() => saveTableOrder()}
                            >
                                <i class="fa-solid fa-utensils px-3"></i>
                                Order
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PosLight
