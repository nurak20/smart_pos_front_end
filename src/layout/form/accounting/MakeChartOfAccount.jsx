import { useEffect, useState } from "react";
import { createAccount } from "../../../api/Account";
import { getAllAccountType } from "../../../api/AccountType";
import CustomCommoBox from "../../../components/select/CustomCommoBox";
import InputValidation from "../../../components/input/InputValidation";
import { IoSaveSharp } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";


const MakeChartOfAccount = () => {
    const [acType, setAcType] = useState([]);
    const [acTypeName, setAcTypeName] = useState([]);
    const { id } = useParams()

    useEffect(() => {
        getAllAccountType().then((response) => {
            setAcType(response.data);
        })
    }, [])
    const [accountData, setAccountData] = useState({
        accountTypeId: '',
        branchId: '',
        code: '',
        accountName: '',
        currency: '',
    });
    const [errors, setErrors] = useState([]);
    function validaiton() {
        const newErrors = {}
        if (!accountData.accountTypeId) {
            newErrors.accountType = 'Account type is require'
        }
        // if(!accountData.branchId){
        //     newErrors.branch = 'Account type is require'
        // }
        if (!accountData.code) {
            newErrors.code = 'Code  is require'
        }
        if (!accountData.accountName) {
            newErrors.accountName = 'AccountName  is require'
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length == 0;
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountData({ ...accountData, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validaiton()) return
        createAccount(accountData).then((reponse) => {

        }).catch(error => {
            console.error(error);
        })
        // Add your form submission logic here, such as an API call
    };
    const handleItemSelected = (item) => {
        setAccountData({ ...accountData, ["accountTypeId"]: item.id });
    };
    const navigate = useNavigate();
    function formHeader() {
        return (
            <div className='form-header-content p-0 py-3'>
                <div className="start">
                    <Button variant="outlined" color="error" onClick={() => navigate('/chart-of-account')}><IoIosArrowRoundBack /><span className='px-2'>Cancel</span> </Button>
                    <div className="ps-3 fs-4 ms-2 border-start text-secondary">{id ? 'Update account' : 'Create new account'}</div>
                </div>
                <div className='d-flex'>
                    {/* <button type="button" class="button preview box-shadow " onClick={preview}><i class="fa-solid fa-circle-info px-2"></i>Preview </button> */}
                    <div className='px-3 pe-0'>
                        <Button variant="contained" color="primary" className="px-4" onClick={handleSubmit}><IoSaveSharp /><span className='px-2'>Save</span> </Button>
                    </div>
                </div>


            </div>
        );
    }
    return (
        <>

            <form action="">
                <div className="container p-3 center ">
                    <div className="row w-100 p-3 box-shadow">
                        <div className="col-12">
                            {formHeader()}
                            <div className="bg-white w-100 rounded">
                                <div className="row">
                                    <div className='d-block col-md-6 col-12'>
                                        <InputValidation
                                            label='Account code'
                                            id='code'
                                            fontSize={14}
                                            name='code'
                                            type='text'
                                            value={accountData.code}
                                            onChange={handleChange}
                                            error={errors.code}
                                        />
                                        <CustomCommoBox
                                            label="Select account type"
                                            items={acType}
                                            fontSize={14}
                                            labelKeys={["accountType"]}
                                            searchKey='accountType'
                                            defaultValueIndex={acType.findIndex(ac => ac.id == accountData.accountTypeId)}
                                            onItemSelected={handleItemSelected}

                                        />



                                    </div>
                                    <div className='d-block col-md-6 col-12'>
                                        <InputValidation
                                            fontSize={14}
                                            label='Account name'
                                            id='name'
                                            name='accountName'
                                            type='text'
                                            value={accountData.accountName}
                                            onChange={handleChange}
                                            error={errors.accountName}
                                        />

                                        {/* <CustomCommoBox
                                            label="Select a Fruit"
                                            items={branch}
                                            labelKeys={["branchName"]}
                                            searchKey='branchName'
                                            onItemSelected={handleItemSelected}
                                        /> */}

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </ form>

        </>
    )
}





export default MakeChartOfAccount
