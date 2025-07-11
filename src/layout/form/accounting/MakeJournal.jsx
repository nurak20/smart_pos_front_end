import { useEffect, useState } from "react";
import { createJournal, createTransaction } from "../../../api/JournalE";
import { getAllAccount } from "../../../api/Account";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";
import { IoSaveSharp } from 'react-icons/io5'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { Tbody, Th, Thead } from "../../../components/table/DataGrid";
import { getBranchId } from "../../../api/Branch";
import { Key } from "@mui/icons-material";
import InputValidation from "../../../components/input/InputValidation";
import Cookies from "js-cookie";
import CustomCommoBox from "../../../components/select/CustomCommoBox";
import { getAllVendor, getVendor } from "../../../api/Vendor";
import { getAllEmployee } from "../../../api/EmployeeApi";
import { userObject } from "../../../api/AppConfig";
import { Button } from "@mui/material";
const MakeJournal = ({ type }) => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [account, setAccount] = useState([]);
    const [acName, setAcName] = useState([])
    const [employee, setEmployee] = useState([]);
    const [vendor, setVendor] = useState([]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
    };

    const [journalData, setJournalData] = useState({
        "journal": type ? type : 'POS',
        "branchId": userObject().branch,
        "partnerId": userObject().branch,
        "date": formatDate(new Date()),
        "total": 0,
        "reference": '',
        "status": "Posted"
    });
    useEffect(() => {
        setJournalData({ ...journalData, ['journal']: type ? type : 'POS' })
    }, [type])
    useEffect(() => {
        getAllAccount().then((reponse) => {
            setAccount(reponse.data);
        }).catch(e => {
            console.error(e);
        })
    }, [])
    function findTotal() {
        let sum = 0;
        for (let i = 0; i < rows.length; i++) {
            sum = sum + parseFloat(rows[i].debit); // Convert to float and handle NaN with || 0
        }
        return sum;// Set total with two decimal places
    }
    function getPartner() {
        getAllVendor().then((reponse) => {
            setVendor(reponse.data);
        }).catch(e => {

        })
        getAllEmployee().then((reponse) => {
            setEmployee(reponse.data)
        }).catch(e => {

        })
    }
    useEffect(() => {
        getPartner();
    }, [journalData.journal])

    // journal request

    function selectJournalType(type) {
        setJournalData({ ...journalData, ['journal']: type.value })
    }
    const [errors, setError] = useState([]);
    function validation() {
        const newError = {};
        // if (!journalData.branchId) {
        //     newError.branch = 'Branch is not found';
        // }
        if (!journalData.journal) {
            newError.journal = 'journal is require';
        }
        if (!journalData.reference) {
            newError.reference = 'reference is require';
        }
        if (!journalData.date) {
            newError.date = 'date is require';
        }


        setError(newError);
        return Object.keys(newError).length === 0;
    }

    // Function to add a new row
    const addRow = () => {
        setRows([...rows, {
            "journalEntriesId": '',
            "accountId": '',
            "label": '',
            "debit": 0,
            "credit": 0
        }]);
        setAcName([...acName, {
            name: ''
        }])

    };

    // Function to handle input changes
    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);

    };
    function removeRow(index) {
        const updatedRows = [...rows]; // Create a copy of the array
        const updateAccountName = [...acName];
        updatedRows.splice(index, 1); // Remove the row at the specified index
        updateAccountName.splice(index, 1);
        setAcName(updateAccountName);
        setRows(updatedRows); // Update the state
    }
    useEffect(() => {
        setJournalData({ ...journalData, ["total"]: findTotal() });
    }, [rows])




    function handleChanges(e) {
        const { name, value } = e.target;
        setJournalData({ ...journalData, [name]: value });
        // setJournalData({ ...journalData, ["total"]: findTotal() });
    }
    const saveJournal = (e) => {
        e.preventDefault();
        if (!validation()) {
            return
        }
        createJournal(journalData).then((response) => {
            for (let i = 0; i < rows.length; i++) {
                const updatedRows = [...rows];

                updatedRows[i]["journalEntriesId"] = response.data.id;
                setRows(updatedRows);
                createTransaction(rows[i]).then((responseT) => {
                })

            }
            setJournalData({
                "journal": '',
                "branchId": userObject().branch,
                "partnerId": '',
                "date": '',
                "total": 0,
                "reference": '',
                "status": "Posted"
            });
            setRows([]);
        }).catch(e => {
            console.error(e);
        })

    }
    function preview(e) {
        e.preventDefault();
        alert(JSON.stringify(rows, null, 2));
    }
    const navigate = useNavigate();


    function formHeader() {
        return (
            <div className='form-header-content px-0 pt-2'>
                <Button variant="outlined" color="error" className="" onClick={() => navigate('/journal')}><IoIosArrowRoundBack /><span className='px-2'>Cancel</span> </Button>
                <div className='d-flex'>
                    <Button variant="contained" color="info" className="" onClick={preview}><i class="fa-solid fa-circle-info px-2"></i>Preview </Button>
                    <div className='px-3 pe-0'>
                        <Button variant="contained" color="success" className="" onClick={saveJournal}><IoSaveSharp /><span className='px-2'>Save</span> </Button>
                    </div>
                </div>


            </div>
        );
    }

    return (
        <>

            <div className="container">
                <div className="container-fluid p-0 center">
                    <div className="row w-100 box-shadow p-3">
                        <div className="col-12">
                            {formHeader()}
                            <div className="bg-white w-100 rounded">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="px-4">
                                            {type == 'POS' ? null :
                                                <>
                                                    {
                                                        type == 'BILL' ?
                                                            <CustomCommoBox
                                                                items={vendor}
                                                                label='Vendor'
                                                                fontSize={14}
                                                                defaultValueIndex={vendor.findIndex(v => v.id == journalData.partnerId)}
                                                                searchKey={['displayName', 'companyName']}
                                                                labelKeys={['displayName']}
                                                                onItemSelected={(select) => setJournalData({ ...journalData, ["partnerId"]: select.id })}

                                                            /> :
                                                            <CustomCommoBox
                                                                items={employee}
                                                                label='Employee'
                                                                fontSize={14}
                                                                defaultValueIndex={employee.findIndex(e => e.id == journalData.partnerId)}
                                                                searchKey={['firstName', 'lastName']}
                                                                labelKeys={['firstName', 'lastName']}
                                                                onItemSelected={(select) => setJournalData({ ...journalData, ["partnerId"]: select.id })}

                                                            />
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-12">

                                        <div className='d-block text-start fs-6 bg-white px-4 py-2'>
                                            {/* <div className='group-input center w-100 pb-3' style={{ fontSize: 14 }}>
                                                <label htmlFor='references' className='w-25 text-start'>Reference <span className="text-danger">*</span>  </label>
                                                <input type="text" id='reference' className='w-75 text-start text-secondary input-box rounded-0' placeholder=""
                                                    name='reference'
                                                    value={journalData.reference}
                                                    onChange={handleChanges}
                                                />
                                            </div> */}
                                            <InputValidation
                                                label="Reference"
                                                id="reference"
                                                type='text'
                                                name='reference'
                                                value={journalData.reference}
                                                require="true"
                                                onChange={handleChanges}
                                                error={errors.reference}
                                                fontSize={14}
                                            />



                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className='d-block text-start bg-white px-4 py-2'>


                                            <InputValidation
                                                label="Date Journal"
                                                id="data"
                                                type='date'
                                                name='date'
                                                value={journalData.date}
                                                require="true"
                                                fontSize={14}
                                                onChange={handleChanges}
                                                error={errors.date}
                                            />
                                            <InputValidation
                                                label="Journal"
                                                id="journal"
                                                type='text'
                                                name='journal'
                                                fontSize={14}
                                                value={journalData.journal}
                                                require="true"
                                                onChange={handleChanges}
                                                error={errors.journal}
                                            />

                                        </div>
                                    </div>
                                </div>


                                <div className='bg-white py-3'>
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="text-dark nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Journal Item</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button class="text-dark nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Note</button>
                                        </li>

                                    </ul>
                                    <div class="tab-content border-0 h-100" id="myTabContent">
                                        <div class="border-0 tab-pane show active h-100" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0" style={{ overflow: 'visible' }}>
                                            <table className="table">
                                                <Thead>
                                                    <Th resizable columnWidth={300} >Account</Th>
                                                    <Th resizable>Label</Th>
                                                    <Th columnWidth={100}>Debit</Th>
                                                    <Th columnWidth={100}>Credit</Th>
                                                    <Th columnWidth={50}>Action</Th>
                                                </Thead>
                                                <Tbody>
                                                    {rows.map((row, index) => (
                                                        <tr key={index}>
                                                            <td className="border-0" style={{ overflow: 'visible' }}>

                                                                <CustomCommoBox
                                                                    bottom={0}
                                                                    top={6.8}
                                                                    className=''
                                                                    items={account}
                                                                    labelKeys={['accountName']}
                                                                    searchKey={['accountName']}
                                                                    defaultValueIndex={account.findIndex(a => a.id == rows[index]['accountId'])}
                                                                    onItemSelected={(e) => {
                                                                        const updatedRows = [...rows];
                                                                        updatedRows[index]["accountId"] = e.id;
                                                                        setRows(updatedRows);
                                                                    }}
                                                                    fontSize={14}
                                                                />
                                                            </td>
                                                            <td className="border-0">
                                                                <InputValidation
                                                                    value={row.label || ""}
                                                                    fontSize={14}
                                                                    name='label'
                                                                    placeHolder='label'
                                                                    onChange={(e) => handleChange(index, e)}
                                                                />
                                                            </td>
                                                            <td className="border-0">
                                                                <InputValidation
                                                                    type='number'
                                                                    value={row.debit}
                                                                    fontSize={14}
                                                                    name='debit'
                                                                    placeHolder='label'
                                                                    onChange={(e) => handleChange(index, e)}
                                                                />

                                                            </td>
                                                            <td className="border-0">
                                                                <InputValidation
                                                                    type='number'
                                                                    value={row.credit}
                                                                    fontSize={14}
                                                                    name='credit'
                                                                    placeHolder='credit'
                                                                    onChange={(e) => handleChange(index, e)}
                                                                />
                                                            </td>
                                                            <td className="border-0">
                                                                <span className="pointer center" onClick={() => removeRow(index)}>
                                                                    <i class="fa-solid fa-trash-can remove"></i>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </Tbody>
                                            </table>
                                            <Button variant="outlined" color="secondary" className="mt-2" onClick={addRow}>Add Line</Button>
                                        </div>
                                        <div class="border-0 tab-pane p-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">

                                            {/* <p className='w-100'>{productData.description}</p> */}

                                        </div>

                                    </div>
                                </div>

                            </div>
                            <h6 className="bg-white text-end mt-3">Total : {journalData.total}</h6>
                        </div>

                    </div>

                </div>
            </div >

        </>
    )
}





export default MakeJournal
