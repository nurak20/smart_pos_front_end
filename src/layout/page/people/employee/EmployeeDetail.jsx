import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEmployeeById, getEmployee } from "../../../../api/EmployeeApi";
import { getAllBranch } from "../../../../api/Branch";
import { getAllEmployee } from "../../../../api/EmployeeApi";
import { el, tr } from "date-fns/locale";
import { IoIosArrowRoundBack, IoIosPersonAdd, IoIosRemove, IoIosRemoveCircle } from "react-icons/io";
import { hostName } from "../../../../api/host";
import Text from "../../../../components/text/Text";
import { createUser, getUserByEmployeeId, removeUserById, updateUserById } from "../../../../api/UserApi";
import InputValidation from "../../../../components/input/InputValidation";
import CustomCommoBox from "../../../../components/select/CustomCommoBox";
import { getDefualtUserId, userObject } from "../../../../api/AppConfig";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Typography } from "@mui/material";
import List from "../../../../components/list/List";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import DetailED from "../../../../components/editRemoveAction/DetailED";
import RemoveMessage from "../../../../components/alert/RemoveMessage";
import { DataGrid, Tbody, Th, Thead } from "../../../../components/table/DataGrid";
import { createWorkShift, deleteWorkShift, getAllWorkShift } from "../../../../api/WorkShift";
import moment from 'moment';
import ED from "../../../../components/editRemoveAction/ED";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import PDFViewer from "../../../pdf/PDFViewer";


const EmployeeDetail = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const domainName = hostName();
    const profilePath = `http://${domainName}:8085/api/images/`
    const [employeeData, setEmployeeData] = useState({
        lastName: '',
        firstName: '',
        schedule: '',
        workShiftID: '',
        managerID: '',
        cv: '',
        positionID: '',
        companyID: '',
        resume: '',
        dayOff: '',
        email: '',
        mobile: '',
        gender: '',
        salary: '',
        address: '',
        bankAccount: '',
        contact: '',
        startWorkingDate: '',
        createdDate: new Date(),
        updatedDate: '',
        image: ''
    });
    const [employeeUser, setEmployeeUser] = useState([]);
    useEffect(() => {
        if (id) {
            getUser();
        }
    }, [id])
    function getUser() {
        getUserByEmployeeId(id).then((response) => {
            setEmployeeUser(response.data);
            console.log(response.data);
        }).catch(e => {

        })
    }

    useEffect(() => {
        if (id) {
            getEmployee(id).then((reponse) => {
                setEmployeeData((prevData) => ({
                    ...prevData,
                    ["lastName"]: reponse.data.lastName,
                    ["firstName"]: reponse.data.firstName,
                    ["schedule"]: reponse.data.schedule,
                    ["workShiftID"]: reponse.data.workShiftID,
                    ["managerID"]: reponse.data.managerID,
                    ["cv"]: reponse.data.cv,
                    ["positionID"]: reponse.data.positionID,
                    ["companyID"]: reponse.data.companyID,
                    ["resume"]: reponse.data.resume,
                    ["dayOff"]: reponse.data.dayOff,
                    ["email"]: reponse.data.email,
                    ["mobile"]: reponse.data.mobile,
                    ["gender"]: reponse.data.gender,
                    ["salary"]: reponse.data.salary,
                    ["address"]: reponse.data.address,
                    ["bankAccount"]: reponse.data.bankAccount,
                    ["contact"]: reponse.data.contact,
                    ["startWorkingDate"]: reponse.data.startWorkingDate,
                    ["createdDate"]: reponse.data.createdDate,
                    ["updatedDate"]: reponse.data.updatedDate,
                    ["image"]: reponse.data.image,
                }));
            })
        }
    }, [id])
    const [employee, setEmployee] = useState([]);
    const [company, setCompany] = useState([]);

    useEffect(() => {
        getAllBranch().then((response) => {
            setCompany(response.data);
        })
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        })
    }, [id]);
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en', {
                weekday: 'long',   // Full day of the week (e.g., "Monday")
                day: '2-digit',    // Two-digit day (e.g., "07")
                month: 'numeric',     // Full month name (e.g., "November")
                year: 'numeric'    // Full year (e.g., "2024")
            }).format(date); // 'dd' for day, 'MMMM' for full month, 'yy' for year
        } catch (e) {
            return (
                <>
                    No data update more ...
                </>
            )
        }
    };
    function getManagerName(id) {
        const findEmployee = employee.find(f => f.id == id);
        if (findEmployee) {
            return (
                <>
                    {findEmployee.firstName} {findEmployee.lastName}

                </>
            )
        } else {
            return (
                <>
                    No Manager
                </>
            )
        }
    }
    function getCompanyName(id) {
        const findCompanyName = company.find(f => f.id == id);
        if (findCompanyName) {
            return findCompanyName.branchName
        } else {
            return (
                <>
                    No Branch Please update data
                </>
            )
        }
    }
    function companyObj(id) {
        const obj = company.find(c => c.id == id);
        if (!obj) return
        return obj
    }

    const userRole = [
        {
            "value": 'SELLER',
        },
        {
            "value": "MANAGER"
        },
        {
            "value": "ADMIN"
        }
    ]

    const [user, setUser] = useState(
        {
            "employeeId": id,
            "username": '',
            "password": '',
            "role": '',
        }
    )
    const [workShift, setWorkShift] = useState(
        {
            "employeeId": id,
            "branchId": userObject().branch,
            "shift": "",
            "startTime": "",
            "endTime": "",
            "description": "",
            "createdDate": '',
            "updatedDate": ''
        }
    )
    function handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setUser((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const [error, setError] = useState([]);
    function validation() {
        const newError = {}
        if (!userId) {
            if (!user.username) {
                newError.user = 'user is require'
            }
            if (!user.password) {
                newError.password = 'password is require'
            }
            if (!user.role) {
                newError.role = 'role is require'
            }
        }
        if (userId) {
            if (!user.password) {
                newError.password = 'password is require'
            }
            if (!confirmPassword) {
                newError.confirm = 'confirm password is require'
            }
            if (confirmPassword != user.password) {
                newError.change = 'confirm is equal to password please try again !'
            }
        }

        setError(newError);
        return Object.keys(newError).length === 0

    }
    const [confirmPassword, setConfirmPassword] = useState();
    function clearForm() {
        setUser({
            "employeeId": id,
            "username": '',
            "password": '',
            "role": '',
        })
    }
    function saveUser(e) {
        e.preventDefault();
        if (!validation()) return;
        if (userId) {
            updateUserById(userId, user).then((response) => {
                setIsFormOpen(false);
                getUser();
                clearForm();
            }).catch(e => {
                console.error(e);

            })
            return
        }
        createUser(user).then((response) => {
            setIsFormOpen(false);
            getUser();
            clearForm();
        }).catch(e => {
            console.error(e);
        })
    }
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [isRemoveUser, setIsRemoveUser] = useState(false);
    function removeEmployee(id) {
        deleteEmployeeById(id).then((response) => {
            navigate('/employees')
        }).catch(e => {

        })
    }
    function formCreateUser() {
        return (
            <>
                <form style={{ maxHeight: '300px', height: '300px' }}>
                    <InputValidation
                        label='Email'
                        fontSize={14}
                        id='username'
                        type='email'
                        name='username'
                        value={user.username}
                        onChange={handleChange}
                        error={error.user}
                    />
                    <InputValidation
                        label='Password'
                        id='password'
                        fontSize={14}
                        type='password'
                        name='password'
                        value={user.password}
                        onChange={handleChange}
                        error={error.password}
                    />
                    <CustomCommoBox
                        label='Select role'
                        items={userRole}
                        labelKeys={["value"]}
                        searchKey={['value']}
                        fontSize={14}
                        defaultValueIndex={userRole.findIndex(u => u.value == user.role)}
                        onItemSelected={(selected) => {
                            setUser((prevData) => ({
                                ...prevData,
                                ['role']: selected ? selected.value : ''
                            }));
                        }}
                        error={error.role}
                    />
                    <div className="mt-1">
                        {/* <Button variant="outlined" color="error" className="py-2 px-5 " onClick={() => setIsFormOpen(false)}>Cancel</Button> */}
                        <Button variant="contained" color="success" className="py-3 px-5 w-100" onClick={saveUser}>Save new user</Button>
                        <Button variant="contained" color="error" className='px-5 mt-2 py-3 w-100' onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>

                    </div>
                </form>
            </>
        )
    }

    function formResetPassword() {
        return (
            <>
                <form style={{ maxHeight: '300px', height: '300px' }}>

                    <InputValidation
                        label='Password'
                        id='password'
                        fontSize={14}
                        type='password'
                        name='password'
                        value={user.password}
                        onChange={handleChange}
                        error={error.password}
                    />
                    <InputValidation
                        label='Confirm Password'
                        id='confirmPassword'
                        fontSize={14}
                        type='password'
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={error.confirm}
                    />

                    {error.change ? <p className="py-3">{error.change}</p> : null}

                    <div className="mt-1">
                        {/* <Button variant="outlined" color="error" className="py-2 px-5 " onClick={() => setIsFormOpen(false)}>Cancel</Button> */}
                        <Button variant="contained" color="success" className="py-3 px-5 w-100" onClick={saveUser}>Save new user</Button>
                        <Button variant="contained" color="error" className='px-5 mt-2 py-3 w-100' onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>

                    </div>
                </form>
            </>
        )
    }
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Converts 0 to 12 for AM/PM format

        return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    };
    function selectWorkShift(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setWorkShift((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const [isWorkshiftFormOpen, setIsWorkShiftFormOpen] = useState(false);
    const [workShiftData, setWorkShiftData] = useState([]);
    function getAllWorkShiftForEmployee() {
        getAllWorkShift().then((response) => {
            setWorkShiftData(response.data);
        }).catch(e => {

        })
    }
    useEffect(() => {
        getAllWorkShiftForEmployee();
    }, [id])
    function saveWorkShift(e) {
        e.preventDefault();
        createWorkShift(workShift).then((response) => {
            getAllWorkShiftForEmployee();
            setIsWorkShiftFormOpen(false);
        }).catch(e => {

        })
    }
    function FormWorkShift() {
        return (
            <>
                <form action="">
                    <div>
                        <InputValidation
                            label='Start Time'
                            id='startTime'
                            type='time'
                            name='startTime'
                            fontSize={14}
                            value={workShift.startTime}
                            onChange={selectWorkShift}
                        />
                        <InputValidation
                            label='End Time'
                            id='endTime'
                            type='time'
                            name='endTime'
                            fontSize={14}
                            value={workShift.endTime}
                            onChange={selectWorkShift}
                        />
                        <InputValidation
                            label='Shift'
                            id='Shift'
                            type='text'
                            name='shift'
                            fontSize={14}
                            value={workShift.shift}
                            onChange={selectWorkShift}
                        />
                        <InputValidation
                            label='Description'
                            id='description'
                            type='text'
                            name='description'
                            fontSize={14}
                            value={workShift.description}
                            onChange={selectWorkShift}
                        />
                        <div>
                            <Button variant="contained" color="success" className="w-100 py-3" onClick={saveWorkShift}>Save new workshift</Button>
                        </div>
                    </div>

                </form>
            </>
        )
    }
    // function formatTime(date) {
    //     return new Date(date).toLocaleTimeString('en-US', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true,
    //     });
    // }
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        let period = 'AM';
        let hour = parseInt(hours);

        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }
        if (hour === 0) {
            hour = 12;
        }

        return `${hour}:${minutes} ${period}`;
    }
    function workShiftList() {
        return (
            <>
                <DataGrid>
                    <table>

                        <Thead>
                            <Th resizable>
                                No
                            </Th>
                            <Th resizable>
                                Shift
                            </Th>
                            <Th resizable>
                                Start Time
                            </Th>
                            <Th resizable>
                                End Time
                            </Th>
                            <Th resizable>
                                Description
                            </Th>
                            <Th resizable>
                                Action
                            </Th>

                        </Thead>
                        <Tbody>
                            {
                                workShiftData.map((ws, index) => {
                                    if (ws.employeeId == id) {
                                        return (
                                            <tr>
                                                <td>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    {ws.shift}
                                                </td>
                                                <td>
                                                    {formatTime(ws.startTime)}
                                                </td>
                                                <td>
                                                    {formatTime(ws.endTime)}
                                                </td>
                                                <td>
                                                    {ws.description}
                                                </td>
                                                <td>
                                                    <ED deleteClick={() => {
                                                        deleteWorkShift(ws.id).then((response) => {
                                                            getAllWorkShiftForEmployee();
                                                        }).catch(e => {

                                                        })
                                                    }} />
                                                </td>
                                            </tr>
                                        )
                                    }
                                }
                                )
                            }


                        </Tbody>

                    </table>
                </DataGrid>
            </>
        )
    }






    return (
        <>


            <div className="container-fluid center">

                <div className="row w-100 ">
                    <div className="col-12 p-0">
                        <Paper className="rounded p-4 w-100">
                            <div className="form-heder w-100 bg-white" style={{ maxHeight: '100%' }}>
                                <Paper elevation={2} className="bg-red" sx={{ background: 'rgb(24, 90, 176)', height: '300px', width: '100%', zIndex: -1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <img src={`http://localhost:8085/api/images/${companyObj(employeeData.companyID)?.image || 'N/A'}`} alt="" className="img-fluid"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Paper>
                                {/* <Paper sx={{ background: 'rgb(24, 90, 176)', height: '300px', width: '100%', zIndex: -1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <img
                                        src={`${IMG_BEST_URL}${imgUrl}`}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Paper> */}
                                <div className="card border-0 px-3 my-2">
                                    <div className="border-0 p-0 position-relative border-0" style={{ marginTop: -100 }}>
                                        <div className="">
                                            <div className="p-2 px-0">
                                                <Paper elevation={3} className='center rounded-circle box-shadow' sx={{ height: '200px', width: '200px', overflow: 'hidden' }}>
                                                    <img src={`${profilePath}${employeeData.image}`} alt="" className="h-100 rounded" />
                                                </Paper>
                                            </div>
                                            <Paper elevation={0} className=''>
                                                <div className="display-name d-flex justify-content-between align-items-center py-2">
                                                    <div className="display-6">
                                                        {employeeData.firstName} {employeeData.lastName}
                                                    </div>
                                                    {userObject().role == 'ADMIN' ? <div className="" style={{ width: '150px' }}>
                                                        <DetailED updateClick={() => navigate(`/update-employee/${id}`)} deleteClick={() => setIsRemoveOpen(true)} />
                                                    </div> :
                                                        null
                                                    }
                                                </div>
                                                <div className="f-14 text-secondary">{employeeData.address} , {employeeData.mobile}</div>
                                                <div className="f-14 text-secondary text-success">Email : {employeeData.email}</div>
                                            </Paper>
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div className="row">
                                {/* general information  */}
                                <Accordion
                                    sx={{
                                        boxShadow: "none", // Remove box-shadow
                                        border: "none",
                                        borderBottom: '1px solid silver',    // Remove border
                                        "&:before": {
                                            display: "none", // Remove the default divider line
                                        },
                                    }}
                                >

                                    <AccordionSummary
                                        expandIcon={<MdOutlineKeyboardArrowUp />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <p className="f-20 py-2 display-name">General Information</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <Text title='Compnay' value={getCompanyName(employeeData.companyID)} fontSize={14} />
                                                <Text title='Employee Address' value={employeeData.address} fontSize={14} />
                                                <Text classValue={'pointer'} title='Manager ? ' value={getManagerName(employeeData.managerID)} fontSize={14} click={() => navigate(`/employee-detail/${employeeData.managerID}`)} />
                                                <Text title='Work Email' value={employeeData.email} fontSize={14} />
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <Text title='Stat Working' value={formatDate(employeeData.startWorkingDate)} fontSize={14} />
                                                <Text title='Contac phone ' value={employeeData.contact} fontSize={14} />
                                                {/* <Text title='Schedule work ' value={employeeData.schedule} fontSize={14} />
                                                <Text title='Work Shift ' value={employeeData.workShiftID} fontSize={14} /> */}
                                                {/* <Text title='Cv ' value={employeeData.cv} fontSize={14} /> */}
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                                {/* CV  */}
                                <Accordion
                                    sx={{
                                        boxShadow: "none", // Remove box-shadow
                                        border: "none",
                                        borderBottom: '1px solid silver',    // Remove border
                                        "&:before": {
                                            display: "none", // Remove the default divider line
                                        },
                                    }}
                                >

                                    <AccordionSummary
                                        expandIcon={<MdOutlineKeyboardArrowUp />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <p className="f-20 py-2 display-name">CV</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Button variant="contained" color="inherit" className="py-3 w-100 my-3">
                                            <a className="nav-link" href={`http://${domainName}:8085/api/images/pdf/${employeeData.cv}`} target="_blank" rel="noopener noreferrer">
                                                Open PDF
                                            </a>
                                        </Button>
                                        <PDFViewer path={`http://${domainName}:8085/api/images/pdf/${employeeData.cv}`} />

                                    </AccordionDetails>
                                </Accordion>
                                {/* work schedule  */}
                                <Accordion
                                    sx={{
                                        boxShadow: "none", // Remove box-shadow
                                        border: "none",
                                        borderBottom: '1px solid silver',    // Remove border
                                        "&:before": {
                                            display: "none", // Remove the default divider line
                                        },
                                    }}
                                >

                                    <AccordionSummary
                                        expandIcon={<MdOutlineKeyboardArrowUp />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <p className="f-20 py-2 display-name">Weekly Employee Work Shift Schedule</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box>
                                            <Paper elevation={0} className="py-3 my-3">
                                                <Button variant="contained" color="success" onClick={() => setIsWorkShiftFormOpen(true)}>
                                                    New Work Schedule
                                                </Button>
                                            </Paper>
                                        </Box>
                                        {
                                            isWorkshiftFormOpen ? FormWorkShift() : workShiftList()
                                        }

                                    </AccordionDetails>
                                </Accordion>

                                {/* private information  */}
                                <Accordion
                                    sx={{
                                        boxShadow: "none", // Remove box-shadow
                                        border: "none",
                                        borderBottom: '1px solid silver',    // Remove border
                                        "&:before": {
                                            display: "none", // Remove the default divider line
                                        },
                                    }}
                                >

                                    <AccordionSummary
                                        expandIcon={<MdOutlineKeyboardArrowUp />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <p className="f-20 py-2 display-name">Private Information</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <Text title='Employee Email' value={employeeData.email} fontSize={14} />
                                                <Text title='Phone Number' value={employeeData.mobile} fontSize={14} />
                                                <Text title='Gender' value={employeeData.gender} fontSize={14} />
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <Text title='Salary' value={' $ ' + employeeData.salary} fontSize={14} />
                                                <Text title='Address' value={employeeData.address} fontSize={14} />
                                                <Text title='Day Off' value={employeeData.dayOff + ' day '} fontSize={14} />
                                                <Text title='Bank' value={employeeData.bankAccount} fontSize={14} />
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                                {/* user  */}
                                <Accordion
                                    sx={{
                                        boxShadow: "none", // Remove box-shadow
                                        border: "none",
                                        borderBottom: '1px solid silver',    // Remove border
                                        "&:before": {
                                            display: "none", // Remove the default divider line
                                        },
                                    }}
                                >

                                    <AccordionSummary
                                        expandIcon={<MdOutlineKeyboardArrowUp />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <p className="f-20 py-2 display-name">User </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="py-1">
                                            {userObject().role == 'ADMIN' ?
                                                <>
                                                    {employeeUser.length == 0 ?
                                                        <>
                                                            {isFormOpen ?
                                                                ''
                                                                :
                                                                <Button variant="contained" color="success" className='px-5 py-2' onClick={() => setIsFormOpen(true)}>
                                                                    New User
                                                                </Button>
                                                            }
                                                        </>
                                                        : null}
                                                </>
                                                :
                                                <>
                                                    <span className="text-seondary">Access denied</span>
                                                </>}
                                            {employeeUser.length > 0 && isFormOpen == false ? (
                                                <div className="box-shadow p-4">
                                                    {employeeUser.map(user =>
                                                        <>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h1 className=" ps-3 border-start " style={{ color: 'rgb(56, 128, 206)' }}>{user.username}</h1>
                                                                <div style={{ width: '150px' }}>
                                                                    <DetailED deleteClick={
                                                                        () => {
                                                                            setIsRemoveUser(true)
                                                                            setUserId(user.userId);
                                                                        }
                                                                    }
                                                                        updateClick={() => {
                                                                            setUserId(user.userId);
                                                                            setIsFormOpen(true);
                                                                        }}
                                                                    />


                                                                </div>
                                                            </div>

                                                            <Text />
                                                            <Text title='Username' value={user.username} fontSize={14} />
                                                            <Text title='Role' value={user.role} fontSize={14} />
                                                            <Text title='Create On' value={user.createdDate ? formatDate(user.createdDate) : 'null value'} fontSize={14} />
                                                            <Text title='Update On' value={user.updatedDate ? formatDate(user.updatedDate) : 'null value'} fontSize={14} />
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <>

                                                    <div className={isFormOpen ? 'd-block h-100' : 'd-none'}>
                                                        {userId ? formResetPassword() : formCreateUser()}
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    </AccordionDetails>
                                </Accordion>

                            </div>

                        </Paper>
                    </div>
                    {/* <div className="col-3">

                        <Paper
                            sx={{
                                position: 'sticky',
                                top: 0
                            }}>
                            <h1 className="fs-5 text-center py-3">More Employee</h1>
                            {

                                employee.map(e => {
                                    if (e.managerID == getDefualtUserId() || userObject().role == 'ADMIN' || e.id == getDefualtUserId()) {
                                        return (
                                            <>
                                                <div className="d-block px-2" style={{ background: e.id == id ? `rgb(241, 241, 241)` : 'white' }} key={e.id} onClick={() => navigate(`/employee-detail/${e.id}`)}>
                                                    <List title={e.firstName + ' ' + e.lastName} subTitle={e.email} imgUrl={e.image} />
                                                </div>
                                            </>
                                        )
                                    }
                                }
                                )
                            }


                        </Paper>
                    </div> */}

                </div>
            </div>

            <RemoveMessage
                isOpen={isRemoveOpen}
                description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                message='Are you sure ?'
                cancelClcik={() => setIsRemoveOpen(false)}
                acceptedClick={() => {
                    id ? removeEmployee(id) : alert('Employee id is null')
                    setIsRemoveOpen(false);
                }}
            />
            <RemoveMessage
                isOpen={isRemoveUser}
                description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                message='Are you sure ?'
                cancelClcik={() => setIsRemoveUser(false)}
                acceptedClick={() => {
                    userId ?
                        removeUserById(userId).then((response) => {
                            getUser();
                            setIsRemoveUser(false);
                            setUserId(null);
                        }).catch(e => {

                        })
                        : alert('User id is null')
                }}
            />

        </>
    )
}





export default EmployeeDetail
