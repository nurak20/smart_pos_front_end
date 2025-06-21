import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hostName } from "../../../../api/host";
import Text from "../../../../components/text/Text";
import { Accordion, AccordionDetails, AccordionSummary, Paper } from "@mui/material";
import List from "../../../../components/list/List";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import DetailED from "../../../../components/editRemoveAction/DetailED";
import { getCustomer } from "../../../../api/Customer";
import { getAllCustomer } from "../../../../api/Customer";
import { getAllVendor } from "../../../../api/Vendor";
import { getVendor } from "../../../../api/Vendor";

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const domainName = hostName();
    const profilePath = `http://${domainName}:8085/api/images/`
    const [vendor, setVendor] = useState([]);
    const [vendorData, setVendorData] = useState(
        {
            "displayName": "",
            "companyName": "",
            "email": "",
            "phone": "",
            "address": "",
            "image": "",
            "active": true
        }
    );
    function getVendorData() {
        getAllVendor().then((response) => {
            setVendor(response.data);
        })
    }
    useEffect(() => {
        getVendorData();
    }, [id])

    useEffect(() => {
        if (id) {
            getVendor(id).then((response) => {
                const data = response.data;

                setVendorData((prevData) => ({
                    ...prevData,
                    displayName: data.displayName || prevData.displayName,
                    companyName: data.companyName || prevData.companyName,
                    email: data.email || prevData.email,
                    phone: data.phone || prevData.phone,
                    address: data.address || prevData.address,
                    image: data.image || prevData.image,
                    active: data.active !== undefined ? data.active : prevData.active,
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
                                            <div className="display-4 display-name py-4">{vendorData.displayName}</div>
                                            <div className="f-14 text-secondary">{vendorData.address} , {vendorData.phone}</div>
                                            <div className="f-14 text-secondary text-success">Email : {vendorData.email}</div>
                                        </Paper>
                                    </div>
                                    <div>
                                        <Paper elevation={5} className='center rounded box-shadow' sx={{ height: '200px', width: '300px', overflow: 'hidden' }}>
                                            <img src={`${profilePath}${vendorData.image}`} alt="" className="h-100 rounded" />
                                        </Paper>
                                        <div className="pt-3">
                                            <DetailED updateClick={() => navigate(`/update-vendor/${id}`)} />
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
                                        <p className="f-20 py-2 display-name">Vendor Location</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <p className="f-16">
                                            {vendorData.address}
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
                                                <Text title='Address' value={vendorData.address} fontSize={14} />
                                                <Text title='Company' value={vendorData.companyName} fontSize={14} />
                                                <Text title='Status' value={vendorData.active} fontSize={14} />
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
                            <h1 className="fs-5 text-center py-3">More Vendor</h1>
                            {

                                vendor.map(e =>
                                    <div className="d-block px-2" style={{ background: e.id == id ? `rgb(241, 241, 241)` : 'white' }} key={e.id} onClick={() => navigate(`/vendor-detail/${e.id}`)}>
                                        <List title={e.displayName} subTitle={e.email} imgUrl={e.image} />
                                    </div>
                                )
                            }


                        </Paper>
                    </div>

                </div>
            </div>

        </>
    )
}





export default VendorDetail
