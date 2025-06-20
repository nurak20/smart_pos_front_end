import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployee } from "../../../../api/EmployeeApi";
import { getAllBranch } from "../../../../api/Branch";
import { getAllEmployee } from "../../../../api/EmployeeApi";
import { el } from "date-fns/locale";
import { IoIosArrowRoundBack, IoIosPersonAdd } from "react-icons/io";
import { hostName } from "../../../../api/host";
import Text from "../../../../components/text/Text";
import { createUser, getUserByEmployeeId } from "../../../../api/UserApi";
import InputValidation from "../../../../components/input/InputValidation";
import CustomCommoBox from "../../../../components/select/CustomCommoBox";
import { userObject } from "../../../../api/AppConfig";
import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from "@mui/material";
import List from "../../../../components/list/List";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import DetailED from "../../../../components/editRemoveAction/DetailED";
import { getCustomer, removeCustomerById } from "../../../../api/Customer";
import { getAllCustomer } from "../../../../api/Customer";
import RemoveMessage from "../../../../components/alert/RemoveMessage";



const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const domainName = hostName();
    const profilePath = `http://${domainName}:8085/api/images/`
    const [customer, setCustomer] = useState([]);
    const [customerData, setCustomerData] = useState({
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "postalCode": "",
        "country": "",
        "joinDate": "",
        "membershipStatus": "SL",
        "status": "ACTIVE",
        "image": ""
    });
    function getCustomerData() {
        getAllCustomer().then((response) => {
            setCustomer(response.data);
        })
    }
    useEffect(() => {
        getCustomerData();
    }, [id])

    useEffect(() => {
        if (id) {
            getCustomer(id).then((response) => {
                const data = response.data;
                setCustomerData((prevData) => ({
                    ...prevData,
                    firstName: data.firstName || prevData.firstName,
                    lastName: data.lastName || prevData.lastName,
                    email: data.email || prevData.email,
                    phoneNumber: data.phoneNumber || prevData.phoneNumber,
                    addressLine1: data.addressLine1 || prevData.addressLine1,
                    addressLine2: data.addressLine2 || prevData.addressLine2,
                    city: data.city || prevData.city,
                    state: data.state || prevData.state,
                    postalCode: data.postalCode || prevData.postalCode,
                    country: data.country || prevData.country,
                    joinDate: data.joinDate || prevData.joinDate,
                    membershipStatus: data.membershipStatus || prevData.membershipStatus,
                    status: data.status || prevData.status,
                    image: data.image,
                }));
            });
        }
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

    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    function removeCustomer(id) {
        removeCustomerById(id).then((response) => {
            navigate('/list-customer')
        }).catch(e => {

        })
    }



    return (
        <>

            <div className="container-fluid center">

                <div className="row w-100 ">
                    <div className="col-9 p-0">
                        <Paper className="rounded p-4 w-100">
                            <div className="form-heder w-100 bg-white" style={{ maxHeight: '100%' }}>
                                <div className='d-flex justify-content-between align-items-center py-3 border-bottom border-2'>
                                    <div>
                                        <Paper elevation={0} className=''>
                                            <div className="display-4 display-name py-4">{customerData.firstName} {customerData.lastName}</div>
                                            <div className="f-14 text-secondary">{customerData.addressLine1} , {customerData.phoneNumber}</div>
                                            <div className="f-14 text-secondary text-success">Email : {customerData.email}</div>
                                        </Paper>
                                    </div>
                                    <div>
                                        {/* {customerData.image} */}
                                        <Paper elevation={5} className='center rounded box-shadow' sx={{ height: '200px', width: '150px', overflow: 'hidden' }}>
                                            {customerData.image ? <img src={`${profilePath}${customerData.image}`} alt="" className="h-100 rounded" /> : 'No Image'}
                                        </Paper>
                                        <div className="pt-3">
                                            <DetailED updateClick={() => navigate(`/update-customer/${id}`)} deleteClick={() => setIsRemoveOpen(true)} />
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                {/* resume  */}
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
                                        <p className="f-20 py-2 display-name">Membership</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <p className="f-16">
                                            {customerData.resume}
                                        </p>
                                    </AccordionDetails>
                                </Accordion>
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
                                                <Text title='City' value={customerData.city} fontSize={14} />
                                                <Text title='Country' value={customerData.country} fontSize={14} />
                                                <Text classValue={'pointer'} title='Postalcode ' value={customerData.postalCode} fontSize={14} click={() => navigate(`/employee-detail/${employeeData.managerID}`)} />

                                            </div>
                                            <div className="col-md-6 col-12">
                                                <Text title='State / Province' value={customerData.state} fontSize={14} />
                                                <Text title='Register date' value={formatDate(customerData.joinDate)} fontSize={14} />
                                                <Text title='Email' value={customerData.email} fontSize={14} />

                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>


                            </div>

                        </Paper>
                    </div>
                    <div className="col-3">

                        <Paper
                            sx={{
                                position: 'sticky',
                                top: 0
                            }}>
                            <h1 className="fs-5 text-center py-3">More Customer</h1>
                            {

                                customer.map(e =>
                                    <div className="d-block px-2" style={{ background: e.id == id ? `rgb(241, 241, 241)` : 'white' }} key={e.id} onClick={() => navigate(`/customer-detail/${e.id}`)}>
                                        <List title={e.firstName + ' ' + e.lastName} subTitle={e.email} imgUrl={e.image} />
                                    </div>
                                )
                            }


                        </Paper>
                    </div>

                </div>
            </div>

            <RemoveMessage
                isOpen={isRemoveOpen}
                description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                message='Are you sure ?'
                cancelClcik={() => setIsRemoveOpen(false)}
                acceptedClick={() => {
                    id ? removeCustomer(id) : alert('Employee id is null')
                    setIsRemoveOpen(false);
                }}
            />

        </>
    )
}





export default CustomerDetail
