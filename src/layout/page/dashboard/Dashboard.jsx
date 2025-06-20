import './dashboard.css'
import { Chart } from 'chart.js/auto';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import ChartRevenues from './Chart/ChartRevenues';
import MostProductOrder from './Chart/MostProductOrder';
import { totalOrderToday } from '../../../api/Order';
import { countEmployee } from '../../../api/EmployeeApi';
import { getAllCustomer } from '../../../api/Customer';
import MonthSaleReport from '../report/monthlysalereport/MonthSale';
import BestSellingMenuItemsChart from '../report/bestsellingproduct/BestSellingMenuItemsChart';
import NetIncomeChart from '../report/netincome/NetIncomeChart';
import { getNetIncomeReport } from '../../../api/Reporting';
import { da } from 'date-fns/locale';
import ChartComponent from '../report/netincome/ChartComponent';
import DailySale from '../report/dailysalereport/DailySale';
import MonthSale from '../report/monthlysalereport/MonthSale';
import ProductSaleReportChart from '../report/bestsellingproduct/ProductSaleReportChart';
import MonthlySaleChartReport from '../report/monthlysalereport/MonthlySaleChartReport';
import { globleCardVariants, globleRowVariants } from '../../../api/AppConfig';
import { motion } from 'framer-motion';
import AnimatedNumber from '../../../components/animation/AnimatedNumber';
import { IoIosArrowRoundDown, IoIosArrowRoundForward } from 'react-icons/io';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { IoTrendingUpSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Revenues from '../report/revenues/Revenues';
import RevenuesChart from '../report/revenues/RevenuesChart';
import ExpenseChart from '../report/expense/ExpenseChart';
import { BsPlus } from 'react-icons/bs';
import { Paper } from '@mui/material';
const Dashboard = ({ UserName }) => {

    const [customer, setCustomer] = useState([]);
    useEffect(() => {
        getAllCustomer().then((response) => {
            setCustomer(response.data);
        })
    }, [])
    const [data, setData] = useState([]);
    const [revenues, setRevenues] = useState();
    const [expense, setExpense] = useState();
    const [income, setIncome] = useState();

    useEffect(() => {
        getNetIncomeReport().then((response) => {
            setData(response.data);
        });
    }, []);
    useEffect(() => {

        try {
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i].totalRevenues;
            }
            setRevenues(sum);
            sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i].totalExpense;
            }
            setExpense(sum);
            sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i].netIncome;
            }
            setIncome(sum);
            console.log('hh')

        } catch (e) {
            return 0;

        }
    }, [data])
    function findTotalRevenues() {

    }
    // function findTotalRevenues() {
    //     let sum = 0;
    //     try {
    //         for (let i = 0; i < data.length; i++) {
    //             sum = sum + data[i].findTotalRevenues;
    //         }
    //         return sum;
    //     } catch (e) {
    //         return 0;

    //     }
    // }
    // function findTotalRevenues() {
    //     let sum = 0;
    //     try {
    //         for (let i = 0; i < data.length; i++) {
    //             sum = sum + data[i].findTotalRevenues;
    //         }
    //         return sum;
    //     } catch (e) {
    //         return 0;

    //     }
    // }
    const [totalOrder, setTotalOrder] = useState();

    const [employeeCount, setCountEmployee] = useState();
    useEffect(() => {
        totalOrderToday().then((response) => {
            setTotalOrder(response.data);
        })
        countEmployee().then((reponse) => {
            setCountEmployee(reponse.data);
        })
    }, [])
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const [loading, setLoading] = useState(true);
    const [dayOfWeek, setDayOfWeek] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const dayNumber = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
        setDayOfWeek(dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`);
    }, []);
    useEffect(() => {
        // Simulate data fetching or other asynchronous actions
        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false after the data is "loaded"
        }, 300); // Adjust time as needed

        return () => clearTimeout(timer); // Clean up timeout on unmount
    }, []);
    const newChartRef = useRef(null);

    useEffect(() => {
        // Check if the canvas ref is attached to a DOM element
        const chartContext = newChartRef.current?.getContext('2d');
        if (!chartContext) return;  // Exit if the canvas isn't available

        // Create the chart instance
        const myChart = new Chart(chartContext, {
            type: 'bar',
            data: {
                labels: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ],
                datasets: [{
                    label: 'Total Orders',
                    data: [1090, 900, 2050, 12003, 1300, 4000, 1090, 900, 2050, 12003, 1300, 4000],
                    backgroundColor: '#38A6CB',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        boxPadding: 3
                    }
                }
            }
        });

        // Cleanup function to destroy chart on component unmount
        return () => {
            myChart.destroy();
        };
    }, [loading]);
    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            }
        },
    };
    const navigate = useNavigate();
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <>
            <div className="mb-2 mt-1 p-2 ">

                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-xl-3 col-md-6 col-12  pb-2">
                            <Paper elevation={2} className="card py-4 pointer  w-100 h-100 border-revenues bg-white" style={{ height: '200px' }}>
                                <div className="card-header border-0 fs-5 d-block bg-none border-0">
                                    <div className='d-flex h-75'>
                                        <div className="w-100 center h-100">
                                            <div className="animated-revenue-card">
                                                <div className="fs-6 text-center"><span className='revenues-color pe-2'><RiMoneyDollarCircleLine /></span>Sale Revenues</div>

                                                {/* Animated Number */}
                                                <AnimatedNumber
                                                    start={0}
                                                    end={revenues}
                                                    duration={1}
                                                    className="fs-1 revenues-color"
                                                />


                                            </div>

                                        </div>
                                    </div>
                                    <div className="h-25 center">
                                        <button className="btn border-0 text-secondary" onClick={() => navigate(`reporting/revenues`)}>View Reporting <IoIosArrowRoundForward /></button>
                                    </div>

                                </div>

                            </Paper>
                        </div>
                        <div className="col-xl-3 col-md-6 col-12 pb-2">
                            <Paper elevation={2} className="card py-4 pointer box-shadow border-expense bg-white" style={{ height: '200px' }}>
                                <div className="card-header border-0 fs-5 d-block bg-none">
                                    <div className='d-flex h-75'>
                                        <div className="w-100 center h-100">
                                            <div>
                                                <div className="fs-6 text-center"><span className='expense-color pe-2'><IoIosArrowRoundDown /></span>Total Expense</div>
                                                <AnimatedNumber
                                                    start={0}
                                                    end={expense}
                                                    duration={1}
                                                    className="fs-1 expense-color"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-25 center">
                                        <button className="btn border-0 text-secondary" onClick={() => navigate(`reporting/expense`)}>View Reporting <IoIosArrowRoundForward /></button>
                                    </div>
                                </div>

                            </Paper>
                        </div>
                        <div className="col-xl-3 col-md-6 col-12 pb-2">
                            <Paper elevation={2} className="card py-4  pointer box-shadow   border-income bg-white" style={{ height: '200px' }}>
                                <div className="card-header border-0 fs-5 d-block bg-none border-0">
                                    <div className='d-flex h-75'>
                                        <div className="w-100 center h-100">
                                            <div>
                                                <div className="fs-6 text-center"><span className='income-color pe-2'><IoTrendingUpSharp /></span>Net Income</div>
                                                <AnimatedNumber
                                                    start={0}
                                                    end={income}
                                                    duration={1}
                                                    className="fs-1 income-color"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-25 center">
                                        <button className="btn border-0 text-secondary bg-white" onClick={() => navigate(`reporting/net-income`)}>View Reporting <IoIosArrowRoundForward /></button>
                                    </div>

                                </div>

                            </Paper>
                        </div>
                        <div className="col-xl-3 col-md-6 col-12 pb-2">
                            <Paper elevation={2} className="card py-4  pointer box-shadow   border-order bg-white" style={{ height: '200px' }}>
                                <div className="card-header border-0 fs-5 d-block bg-none border-0">
                                    <div className='d-flex h-75'>
                                        <div className="w-100 center h-100">
                                            <div>
                                                <div className="fs-6  "><span className='order-color pe-2'><BsPlus /></span>Daily Sale</div>
                                                <AnimatedNumber
                                                    start={0}
                                                    end={totalOrder}
                                                    duration={1}
                                                    className="fs-1 order-color"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-25 center">
                                        <button className="btn border-0 text-secondary" onClick={() => navigate(`/pos-order`)}>View Reporting <IoIosArrowRoundForward /></button>
                                    </div>

                                </div>

                            </Paper>
                        </div>
                    </div>
                </div>


                <div className='container-fluid w-100 p-0 center my-2  rounded '>
                    <div className="row w-100 p-0">
                        <div className="col-xl-6 p-1">
                            <motion.div
                                className="card border-0 bgso  center box-shadow h-100"
                                key={0}
                                custom={0} // Pass index for staggered animation
                                variants={globleCardVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="card-body w-100 p-3 bg-white rounded "  >
                                    <h6 className='p-3 px-0'>Monthly Sale Reporting</h6>
                                    <MonthlySaleChartReport />
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-xl-6 p-1">
                            <motion.div
                                key={1}
                                custom={1} // Pass index for staggered animation
                                variants={globleCardVariants}
                                initial="hidden"
                                animate="visible"
                                className="card border-0 bgso  center box-shadow h-100">
                                <div className="card-body w-100 p-3 bg-white rounded "  >
                                    <h6 className='p-3 px-0'>Sale Reporting</h6>
                                    <ProductSaleReportChart />
                                </div>
                            </motion.div>
                        </div>


                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4 p-2">
                            <div className='box-shadow p-1 bg-white'>
                                <p className="fs-6 p-2">Revenues Chart</p>
                                <RevenuesChart />
                            </div>
                        </div>
                        <div className="col-md-4 p-2">
                            <div className='box-shadow p-1 bg-white'>
                                <p className="fs-6 p-2">Expense Chart</p>
                                <ExpenseChart />
                            </div>
                        </div>
                        <div className="col-md-4 p-2">

                            <div className='box-shadow p-1 bg-white'>
                                <p className="fs-6 p-2">Net Income Chart Chart</p>
                                <ChartComponent />
                            </div>
                        </div>
                    </div>
                </div>

            </div >




        </>
    )
}

export default Dashboard
