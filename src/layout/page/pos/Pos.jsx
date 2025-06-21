import React, { useState } from 'react';
import './postest.css';
import { LiaSearchSolid } from 'react-icons/lia';
import { IoIosAdd, IoIosArrowRoundBack, IoIosPersonAdd } from 'react-icons/io';
import { LuMinus } from 'react-icons/lu';
import { BsPlus } from 'react-icons/bs';
import { HiShoppingCart } from 'react-icons/hi2';
import { TbShoppingCartX } from 'react-icons/tb';
import { PiCheckCircleLight } from "react-icons/pi";
import { IoMdPersonAdd } from "react-icons/io";
import { IoArrowForwardCircleOutline } from 'react-icons/io5';
import Box from '@mui/material/Box';
import { Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CustomCommoBox from '../../../components/select/CustomCommoBox';
import ProductCard from '../../../components/card/ProductCard';
import List from '../../../components/list/List';
import Calculator from '../../../components/calculator/Calculator';
import Modal from '../../../components/modal/Modal';
import { globleRowVariants } from '../../../api/AppConfig';
import InputValidation from '../../../components/input/InputValidation';

const Pos = () => {
    // Static data for demonstration
    const categories = [
        { id: 1, name: "All Category", image: "category1.jpg" },
        { id: 2, name: "Beverages", image: "category2.jpg" },
        { id: 3, name: "Food", image: "category3.jpg" },
    ];

    const product = [
        { id: 1, productName: "Coffee", price: 2.50, image: "coffee.jpg", categoryId: 2 },
        { id: 2, productName: "Tea", price: 1.50, image: "tea.jpg", categoryId: 2 },
        { id: 3, productName: "Sandwich", price: 5.00, image: "sandwich.jpg", categoryId: 3 },
    ];

    const customer = [
        { id: 1, firstName: "John", lastName: "Doe", phoneNumber: "1234567890", image: "customer1.jpg" },
        { id: 2, firstName: "Jane", lastName: "Smith", phoneNumber: "0987654321", image: "customer2.jpg" },
    ];

    const paymentmethod = [
        { id: 1, text: "CASH", value: 'CASH' },
        { id: 2, text: "Kh QR", value: 'KH QR' },
    ];

    const discount = [
        { id: 1, label: "Discount 0%", value: 0 },
        { id: 2, label: "Discount 25%", value: 25 },
        { id: 3, label: "Discount 40%", value: 40 },
    ];

    // Static UI state
    const [activeIndex, setActiveIndex] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPayment, setIsPayment] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [numberRememberCustomer, setNumberRememberCustomer] = useState('Table 1');
    const [received, setReceived] = useState('10.00');
    const [paymentmethods, setPaymentMethod] = useState('CASH');
    const [customerId, setCustomerId] = useState(1);
    const [paymentSD, setPaymentUSD] = useState(15.00);
    const [discounts, setDiscount] = useState(0);
    const [itemOrder, setItemOrder] = useState([
        { productId: 1, qty: 2, price: 2.50, amounts: 5.00, image: "coffee.jpg" },
        { productId: 3, qty: 1, price: 5.00, amounts: 5.00, image: "sandwich.jpg" },
    ]);
    const [totalPay, setTotalPay] = useState(10.00);
    const [profile, setProfile] = useState('default-profile.jpg');
    const [employeeName, setEmployeeName] = useState('John Doe');
    const [role, setRole] = useState('Cashier');

    // Static UI functions
    const listTable = () => (
        <div className="card border-0 bg-none">
            <div className="card-body p-0 border-0 bg-none ps-2" style={{
                overflow: 'scroll', scrollbarWidth: 'none',
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
                        {itemOrder.map((f, i) => (
                            <motion.tr
                                key={i}
                                custom={i}
                                variants={globleRowVariants}
                                initial="hidden"
                                animate="visible"
                                className="pointer"
                            >
                                <td className='py-3'>{i + 1}</td>
                                <td>
                                    <div className="start">
                                        <div className="center" style={{ height: '70px' }}>
                                            <img src={`imageUrl/${f.image}`} className='h-100 rounded ' alt="" />
                                        </div>
                                        <div className='ps-2'>
                                            {product.find(p => p.id === f.productId)?.productName || "Product"}
                                        </div>
                                    </div>
                                </td>
                                <td>{formatCurrency.format(f.price)}</td>
                                <td>{f.qty}</td>
                                <td>{formatCurrency.format(f.amounts)}</td>
                                <td>
                                    <div className='font-12'>
                                        <button className='btn font-12 small-i box-shadow'>-</button>
                                        <span className='bg-none small-i mx-1 text-dark'>{f.qty}</span>
                                        <button className='btn font-12 small-i box-shadow'>+</button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const payment = () => (
        <div className="">
            <div className="row">
                <div className="col-xl-8 col-lg-6 col-12 col-md-6 col-12 d-block">
                    <div className='container-fluid w-100 mt-5' style={{ maxWidth: '900px' }}>
                        <div className='display-6 text-badges-green text-center'>
                            Total Payment: {formatCurrency.format(paymentSD || totalPay)}
                        </div>
                        {listTable()}
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-12">
                    <div className='bg-none p-3' style={{ height: '100vh' }}>
                        <div className="bg-none rounded h-100 box-shadow" style={{ position: 'relative', overflow: 'scroll' }}>
                            <div className="h-50 p-3">
                                {customerId ? (
                                    <p className='fs-5 display-name py-3 text-success'>
                                        Customer {customer.find(c => c.id == customerId)?.firstName} {customer.find(c => c.id == customerId)?.lastName}
                                    </p>
                                ) : null}
                                <Button variant='contained' startIcon={<IoIosPersonAdd className='fs-3' />} className='py-3 mb-3 w-100 fs-5 center'>
                                    Customer
                                </Button>
                                <CustomCommoBox
                                    fontSize={16}
                                    label='Select payment method'
                                    items={paymentmethod}
                                    defaultValueIndex={0}
                                    onItemSelected={() => { }}
                                    labelKeys={["text"]}
                                    searchKey={"text"}
                                />
                                <CustomCommoBox
                                    fontSize={16}
                                    label='Select discount'
                                    items={discount}
                                    defaultValueIndex={0}
                                    onItemSelected={() => { }}
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
                                    <div className=''>
                                        <Calculator value={received} placeholder='Enter Received' />
                                    </div>
                                    <div className="row py-2">
                                        <div className='col-4 pe-1'>
                                            <Button variant='contained' color='error' className='h-100 w-100 py-4' onClick={() => setIsPayment(false)}>
                                                Back
                                            </Button>
                                        </div>
                                        <div className="col-8">
                                            <Button variant='contained' startIcon={<PiCheckCircleLight />} color='success' className='h-100 w-100 py-4'>
                                                Complete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const staffAction = () => (
        <div className='h-40'>
            <div className='position-absolute bottom-0 w-100 px-3'>
                <div className="d-flex justify-content-between align-items-center text-dark w-100">
                    <div className='w-100 start text-secondary f-16 display-name'>Total USD :</div>
                    <div className='bold text-badges-green display-name'>{formatCurrency.format(totalPay)}</div>
                </div>
                <div className='row mt-1 p-2 rounded px-0'>
                    <div className='col-12 pe-0'>
                        <Calculator value={numberRememberCustomer} />
                    </div>
                    <div className="col-6 pe-0 py-2 pb-1">
                        <Button variant='contained' color='success' className="h-100 w-100 py-3">
                            <i className="fa-solid fa-utensils"></i>
                            <span className='ps-2'>Hold Order</span>
                        </Button>
                    </div>
                    <div className="col-6 pe-0 py-2 pb-1">
                        <Button variant='contained' color='success' className="w-100 h-100 py-3">
                            <i className="fa-solid fa-arrow-right pe-2"></i> Payment
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const customerModal = () => (
        <div className="modal animation-opacity" id="modalCustomer" tabIndex="-1" aria-labelledby="modalCustomerModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {customerId ? `${customer.find(c => c.id == customerId).firstName} ${customer.find(c => c.id == customerId).lastName}` : 'No Customer Selected'}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <Paper className="modal-body" sx={{ width: '100%', maxHeight: '600px', overflowY: 'scroll' }}>
                        {customer.map(c => (
                            <div onClick={() => setCustomerId(c.id)} style={{ background: c.id == customerId ? 'rgb(246, 246, 246)' : '' }}>
                                <List imgUrl={c.image} title={`${c.firstName} ${c.lastName}`} subTitle={c.phoneNumber} />
                            </div>
                        ))}
                    </Paper>
                    <div className="modal-footer">
                        <Button variant='contained' color='error' data-bs-dismiss="modal" className='py-2'>Discard</Button>
                        <Button variant='contained' color='primary' className='ms-1 py-2' data-bs-dismiss="modal">Save changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );

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

    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    return (
        <>
            <div className="d-flex pos">
                <div className="pos-info w-100 d-flex rounded bg-white" style={{
                    height: '100vh',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}>
                    <div className='w-100 px-2 h-100'>
                        <div className='d-flex justify-content-between align-items-center my-2 px-2 py-2 rounded box-shadow border'
                            style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                            <div>
                                <p className='f-16 px-3 border-3 border-start'>Company's Main Branch</p>
                            </div>
                            <div className='start text-start pe-3'>
                                <p className="center rounded-circle box-shadow p-1 border borde-success" style={{ height: '60px', width: '60px', overflow: 'hidden' }}>
                                    <img src={`imageUrl/${profile}`} alt="" className='h-100 rounded-circle' />
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
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}>
                                <div className="center">
                                    <Paper
                                        className={`pointer button-pos-category category me-1 ${activeIndex === 0 ? "button-pos-category active-category" : ""}`}
                                        onClick={() => {
                                            setActiveIndex(0)
                                            setCategoryId(null)
                                        }}
                                    >
                                        <div className="" style={{ height: '40px', overflow: 'hidden' }}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/737/737967.png" className='h-100' alt="" />
                                        </div>
                                        <div className='py-2 ps-3 d-block text-start'>
                                            <div className="f-16">All Category</div>
                                            <div className='f-10'>{product.length} Item</div>
                                        </div>
                                    </Paper>
                                </div>
                                {categories.map((c, index) => (
                                    <motion.div
                                        key={c.id}
                                        custom={index}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="center"
                                    >
                                        <Paper
                                            elevation={1}
                                            className={`pointer button-pos-category category me-1 ${activeIndex === index + 1 ? "button-pos-category active-category" : ""}`}
                                            onClick={() => {
                                                setActiveIndex(index + 1)
                                                setCategoryId(c.id)
                                            }}
                                        >
                                            <div className='' style={{ height: '40px', overflow: 'hidden' }}>
                                                <img src={`categoryPathImage/${c.image}`} alt="" className='h-100' />
                                            </div>
                                            <div className='py-2 ps-3 d-block text-start'>
                                                <div className="f-16">{c.name}</div>
                                                <div className='f-10'>{product.filter(p => p.categoryId === c.id).length} Item</div>
                                            </div>
                                        </Paper>
                                    </motion.div>
                                ))}
                            </div>
                            <div className='row py-2'>
                                {product.map((p, index) => {
                                    if (p.categoryId == categoryId || categoryId == null) {
                                        return (
                                            <motion.div
                                                key={p.id}
                                                custom={index}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 p-2"
                                            >
                                                <ProductCard
                                                    image={p.image}
                                                    price={p.price}
                                                    name={p.productName}
                                                    onClick={() => { }}
                                                />
                                            </motion.div>
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-block d-xl-none fixed-bottom border border-secondary rounded-0 bg-white">
                    <button className="btn-pay w-100 rounded-0 py-3 text-white" type="button">
                        {formatCurrency.format(totalPay)}
                    </button>
                </div>
                <div className='pos-view-order p-0 d-none d-xl-block bg-light p-1 rounded'>
                    <div className="border-0 h-100 bg-white box-shadow" style={{
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        position: 'relative'
                    }}>
                        <div className={true ? 'h-90 px-2' : 'px-2 h-60'} style={{
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}>
                            {itemOrder.length > 0 ? itemOrder.map((i, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={globleRowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="w-100 border-0 border-bottom border-secondary"
                                    style={{ height: '110px' }}
                                >
                                    <div className="d-flex justify-content-between align-items-center border-0 w-100">
                                        <div className="w-25 center">
                                            <div className="rounded-circle center shadow" style={{ height: '90px', width: '90px', overflow: 'hidden' }}>
                                                <img src={`imageUrl/${i.image}`} alt="" className="h-100" style={{ objectFit: 'cover' }} />
                                            </div>
                                        </div>
                                        <div className="ps-2 w-75" style={{ maxWidth: '100%' }}>
                                            <div className="w-100">
                                                <div className="d-flex justify-content-between align-items-center" style={{ height: '50px' }}>
                                                    <span className="font-14 text-truncate w-100">
                                                        {product.find(p => p.id === i.productId)?.productName || "Product"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center" style={{ height: '50px' }}>
                                                    <div className="w-100">
                                                        <span className="fs-5 text-badges-red">{formatCurrency.format(i.price)}</span>
                                                        <span className="font-12 ps-2"> / unit</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <span className="small-i text-badges-danger box-shadow me-2 pointer">
                                                            <LuMinus />
                                                        </span>
                                                        <span className="bg-none text-dark text-badges-danger mx-2">{i.qty}</span>
                                                        <span className="small-i text-badges-green box-shadow ms-2 pointer">
                                                            <IoIosAdd />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className='h-100 w-100 center'>
                                    <div className='d-block text-center fs-1'>
                                        <TbShoppingCartX />
                                        <div className='fs-4'>No Item</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='h-10'>
                            <div className='position-absolute bottom-0 w-100 px-3 pb-3'>
                                <p className="fs-3 display-name text-center py-3">TOTAL : {formatCurrency.format(totalPay)}</p>
                                <Button variant='contained' color='success' className='w-100 py-3 h-100'>
                                    <span className='pe-2'>Payment</span> <IoArrowForwardCircleOutline className='fs-5' />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {customerModal()}
            <Modal isOpen={isPayment} children={payment()} />
            <Modal isOpen={isPaymentSuccess} children={<div>Payment Success Modal</div>} />

            <div className="offcanvas offcanvas-start w-100" tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasBottomLabel">View order</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body w-100 px-1">
                    <div className="between text-dark fs-4 py-3">
                        <div className='w-100 start fs-5'>Total Payment :</div>
                        <div className='text-dark fw-bold'>{formatCurrency.format(totalPay)}</div>
                    </div>
                    <div className="button-grid">
                        <button className='btn-grid'><i className="fa-solid fa-user-plus pe-2"></i> Customer </button>
                        <button className='btn-grid'><i className="fa-solid fa-cart-shopping pe-2"></i> Order Table</button>
                        <button className='bg-orange btn-grid'>
                            <input type="text" className='border-0 bg-none h-100 w-100' placeholder='Enter number of table' value={numberRememberCustomer} />
                        </button>
                        <button className='btn-grid'><i className="fa-solid fa-circle-info pe-2"></i> Enter Code</button>
                    </div>
                    <div className='d-flex mt-1'>
                        <div style={{ height: '100%' }}>
                            <Calculator value={numberRememberCustomer} />
                        </div>
                        <div className="d-block w-100">
                            <button className="btn-silver rounded-0 h-25 border box-shadow w-100 d-block fs-6">
                                <i className="fa-solid fa-arrow-right pe-2"></i> Payment
                            </button>
                            <button className="btn-order rounded-0 h-75 text-white box-shadow w-100 d-block fs-6">
                                <i className="fa-solid fa-utensils px-3"></i>
                                Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Pos;