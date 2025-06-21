import { Box, Button, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAllEmployee } from '../../../../api/EmployeeApi'
import { hostName } from '../../../../api/host'
import { useNavigate, useParams } from 'react-router-dom'
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { getBranchById } from '../../../../api/Branch'
import { RiBuildingFill, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { IncomeByBranches } from '../../../../api/Reporting'
import AnimatedNumber from '../../../../components/animation/AnimatedNumber'
import { IoTrendingDownSharp } from 'react-icons/io5'
import { MdEmail, MdOutlineArrowCircleUp } from "react-icons/md";
import { IoIosArrowRoundForward } from 'react-icons/io'
import IncomeChartByBranches from './IncomeChartByBranches'
import { CiEdit } from 'react-icons/ci'
import { getDefualtUserId, userObject } from '../../../../api/AppConfig'

const CompanyDetail = ({ branch }) => {
    const domainName = hostName();
    const IMG_BEST_URL = `http://${domainName}:8085/api/images/`;
    const [employee, setEmployee] = useState([]);

    //declare branch data

    const [branchName, setBranchName] = useState();
    const [address, setAddress] = useState();
    const [phone, setPhone] = useState();
    const [image, setImage] = useState();
    const [revenues, setRevenues] = useState();
    const [expense, setExpense] = useState();
    const [income, setIncome] = useState();
    const [data, setData] = useState([]);
    const [email, setEmail] = useState();


    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        getAllEmployee()
            .then((response) => {
                setEmployee(response.data);
            })
            .catch((e) => {
                console.error("Error fetching employees:", e);
            });

        if (id) {
            getBranchById(id)
                .then((response) => {
                    setBranchName(response.data.branchName);
                    setAddress(response.data.addressLine1);
                    setPhone(response.data.phoneNumber);
                    setImage(response.data.image);
                    setEmail(response.data.email)
                })
                .catch((e) => {
                    console.error("Error fetching branch:", e);
                });
        }
        if (branch) {
            getBranchById(branch)
                .then((response) => {
                    setBranchName(response.data.branchName);
                    setAddress(response.data.addressLine1);
                    setPhone(response.data.phoneNumber);
                    setImage(response.data.image);
                    setEmail(response.data.email)
                })
                .catch((e) => {
                    console.error("Error fetching branch:", e);
                });
        }
    }, [id, branch]);


    // const findManager = employee.find(
    //     (e) => e.companyID === parseInt(id) && e.managerID === null
    // );

    // if (!findManager) {
    //     console.log("No manager found for this branch.");
    // } else {
    //     console.log("Manager found:", findManager);
    // }

    useEffect(() => {
        IncomeByBranches(id).then((response) => {
            setData(response.data)
            // console.log(response.data)
            // alert(JSON.stringify(response.data, null, 2))
        });
        if (branch) {
            IncomeByBranches(branch).then((response) => {
                setData(response.data)
                // console.log(response.data)
                // alert(JSON.stringify(response.data, null, 2))
            });
        }
    }, [id]);
    useEffect(() => {

        try {
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i].totalRevenue;
            }
            setRevenues(sum);
            sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i].totalExpenses;
            }
            setExpense(sum);
            sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i].income;
            }
            setIncome(sum);
            console.log('hh')

        } catch (e) {
            return 0;

        }
    }, [data])



    return (
        <>

            <div className="container-fluid p-2">


                <div className="row w-100">
                    <div className="col-12">
                        <Box>
                            <Paper elevation={0} className='p-3'>
                                {/* <Paper sx={{ height: 300, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img
                                        src={`${IMG_BEST_URL}${image}`}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Paper> */}

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h1 className='display-6'>
                                                {branchName}
                                            </h1>
                                            {
                                                branch ?
                                                    ''
                                                    :
                                                    id ? <div onClick={() => navigate(`/update-branch/${id}`)}>
                                                        <Button variant='contained' color='success' className='fs-4 px-3'><CiEdit /></Button>
                                                    </div> : ''
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <Paper elevation={1} sx={{ height: '150px' }} className='start'>
                                            <div className='ps-3'>
                                                <p className="title f-16 start"><RiMoneyDollarCircleLine className='text-success' /><span className='ps-2'>Sale Revenues</span></p>
                                                <h1 className="display-6">{<AnimatedNumber start={0} end={revenues} />}</h1>
                                                <p className='pointer f-14 text-secondary'>
                                                    <span className='pe-2'>View Reporting</span> <IoIosArrowRoundForward />
                                                </p>
                                            </div>
                                        </Paper>
                                    </div>
                                    <div className="col-md-4">
                                        <Paper elevation={1} sx={{ height: '150px' }} className='start'>
                                            <div className='ps-3'>
                                                <p className="title start"><IoTrendingDownSharp className='text-danger' /><span className='ps-2'>Expense</span></p>
                                                <h1 className="display-6">{<AnimatedNumber start={0} end={expense} />}</h1>
                                                <p className='pointer f-14 text-secondary' >
                                                    <span className='pe-2'>View Reporting</span> <IoIosArrowRoundForward />
                                                </p>
                                            </div>
                                        </Paper>
                                    </div>
                                    <div className="col-md-4">
                                        <Paper elevation={1} sx={{ height: '150px' }} className='start'>
                                            <div className='ps-3'>
                                                <p className="title start"><MdOutlineArrowCircleUp className='text-primary' /><span className='ps-2'>InCome</span></p>
                                                <h1 className="display-6">{<AnimatedNumber start={0} end={income} />}</h1>
                                                <p className='pointer f-14 text-secondary'>
                                                    <span className='pe-2'>View Reporting</span> <IoIosArrowRoundForward />
                                                </p>
                                            </div>
                                        </Paper>
                                    </div>
                                    <div className="col-12">
                                        {id ? <IncomeChartByBranches id={id} /> : branch ? <IncomeChartByBranches id={branch} /> : null}
                                    </div>
                                </div>
                            </Paper>
                        </Box>
                    </div>
                    <div className="col-md-6">
                        <Paper elevation={1} className='p-3' sx={{ height: 500, overflowY: 'scroll' }}>
                            <Paper elevation={0}>
                                <p className="f-18 text-center">Employee</p>
                                <p className="f-12 text-center text-secondary">List all employee in compnay's {branchName}</p>
                            </Paper>
                            {
                                employee.map(emp => {
                                    if (emp.companyID == id || emp.managerID == getDefualtUserId() || emp.id == getDefualtUserId()) {
                                        return (

                                            <div onClick={() => navigate('/employee-detail/' + emp.id)}
                                                style={{ height: '80px', width: '100%', overflow: 'hidden', marginBottom: 4, display: 'flex', justifyContent: 'start', alignItems: 'center', padding: 2 }}
                                                className='border-bottom pointer'
                                            >
                                                <Paper sx={{ height: 60, width: 60, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                    <img
                                                        src={`${IMG_BEST_URL}${emp.image}`}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Paper>
                                                <Paper elevation={0} className='p-1' sx={{ height: 50, width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'start', alignItems: 'center', marginLeft: 2 }}>
                                                    <div className='d-block'>
                                                        <p>{emp.firstName} {emp.lastName} (Seller)</p>
                                                        <p className='f-14 text-secondary'>(+885) {emp.mobile}</p>
                                                    </div>
                                                </Paper>
                                            </div>
                                        )
                                    }
                                }
                                )
                            }

                        </Paper>
                    </div>
                    <div className="col-md-6">

                        <Paper elevation={1} className='p-3' sx={{ height: 500, overflowY: 'scroll' }}>
                            <Paper elevation={0}>
                                <p className="f-18 text-center">Company Inormation</p>
                                <p className="f-12 text-center text-secondary">display compnay's {branchName} detail information</p>
                            </Paper>
                            <div
                                style={{ height: '80px', width: '100%', overflow: 'hidden', marginBottom: 4, display: 'flex', justifyContent: 'start', alignItems: 'center', padding: 2 }}
                                className='border-bottom pointer'
                            >
                                <Paper className='rounded-circle' sx={{ height: 60, width: 60, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <RiBuildingFill className='fs-3' />
                                </Paper>
                                <Paper elevation={0} className='p-1' sx={{ height: 50, width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'start', alignItems: 'center', marginLeft: 2 }}>
                                    <div className='d-block'>
                                        <p className='f-14 text-secondary'>Company </p>
                                        <p>{branchName}</p>

                                    </div>
                                </Paper>
                            </div>
                            <div
                                style={{ height: '80px', width: '100%', overflow: 'hidden', marginBottom: 4, display: 'flex', justifyContent: 'start', alignItems: 'center', padding: 2 }}
                                className='border-bottom pointer'
                            >
                                <Paper className='rounded-circle' sx={{ height: 60, width: 60, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <FaLocationDot className='fs-3' />
                                </Paper>
                                <Paper elevation={0} className='p-1' sx={{ height: 50, width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'start', alignItems: 'center', marginLeft: 2 }}>
                                    <div className='d-block'>
                                        <p className='f-14 text-secondary'>address </p>
                                        <p>{address}</p>

                                    </div>
                                </Paper>
                            </div>

                            <div
                                style={{ height: '80px', width: '100%', overflow: 'hidden', marginBottom: 4, display: 'flex', justifyContent: 'start', alignItems: 'center', padding: 2 }}
                                className='border-bottom pointer'
                            >
                                <Paper className='rounded-circle' sx={{ height: 60, width: 60, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <FaPhone className='fs-3' />
                                </Paper>
                                <Paper elevation={0} className='p-1' sx={{ height: 50, width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'start', alignItems: 'center', marginLeft: 2 }}>
                                    <div className='d-block'>
                                        <p className='f-14 text-secondary'>contact </p>
                                        <p>(+885){phone}</p>

                                    </div>
                                </Paper>
                            </div>
                            <div
                                style={{ height: '80px', width: '100%', overflow: 'hidden', marginBottom: 4, display: 'flex', justifyContent: 'start', alignItems: 'center', padding: 2 }}
                                className='border-bottom pointer'
                            >
                                <Paper className='rounded-circle' sx={{ height: 60, width: 60, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <MdEmail className='fs-3' />
                                </Paper>
                                <Paper elevation={0} className='p-1' sx={{ height: 50, width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'start', alignItems: 'center', marginLeft: 2 }}>
                                    <div className='d-block'>
                                        <p className='f-14 text-secondary'>Email </p>
                                        <p>(E){email}</p>

                                    </div>
                                </Paper>
                            </div>


                        </Paper>
                    </div>

                </div>
            </div>

        </>
    )
}

export default CompanyDetail
