import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputValidation from '../../components/input/InputValidation';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSaveSharp } from 'react-icons/io5';
import { createBranch, getBranchById, updateBranch } from '../../api/Branch';
import { getAllEmployee, updateEmployee } from '../../api/EmployeeApi';
import CustomCommoBox from '../../components/select/CustomCommoBox';
import { uploadImage } from '../../api/ImageApi';

const BranchForm = () => {
    const [employee, setEmployee] = useState([]);
    const [branch, setBranch] = useState({
        branchName: '',
        managerId: '',
        branchCode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Cambodia',
        phoneNumber: '',
        email: '',
        establishedDate: '',
        status: 'Active',
        image: ''
    });
    const { id } = useParams();
    useEffect(() => {
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        })
    }, [])
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
    };
    useEffect(() => {
        if (id) {
            getBranchById(id).then(response => {
                setBranch({
                    branchName: response.data.branchName,
                    managerId: response.data.managerId,
                    branchCode: response.data.branchCode,
                    addressLine1: response.data.addressLine1,
                    addressLine2: response.data.addressLine2,
                    city: response.data.city,
                    state: response.data.state,
                    postalCode: response.data.postalCode,
                    country: response.data.country,
                    phoneNumber: response.data.phoneNumber,
                    email: response.data.email,
                    establishedDate: formatDate(response.data.establishedDate),
                    status: response.data.status,
                    image: response.data.image
                });
            }).catch(e => {
                console.error('Error fetching branch:', e);
            });
        }
    }, [id]);
    function clearForm() {
        setBranch({
            branchName: '',
            managerId: '',
            branchCode: '',
            addressLine1: '',
            city: '',
            state: '',
            country: 'Cambodia',
            phoneNumber: '',
            email: '',
            establishedDate: '',
            status: 'Active',
            image: ''
        })
    }

    const [errors, setErrors] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    function validateForm() {
        const newErrors = {};
        if (!branch.branchName) newErrors.branchName = 'Branch name is required';
        if (!branch.managerId) newErrors.managerId = 'Manager ID is required';
        if (!branch.branchCode) newErrors.branchCode = 'Branch code is required';
        if (!branch.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setBranch(prevData => ({ ...prevData, [name]: value }));
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const imageURL = URL.createObjectURL(file);
        setSelectedImage(imageURL);
        setFile(file);
        setBranch(prevData => ({ ...prevData, image: file.name }));
    };

    function saveBranch(e) {
        e.preventDefault();
        if (!validateForm()) return;
        const apiCall = id ? updateBranch(id, branch) : createBranch(branch);
        apiCall.then(() => {
            console.log(`${id ? 'Branch has updated' : 'Branch created'} successfully`);

            // upload image
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                uploadImage(formData).then(() => {
                    console.log('Image uploaded successfully');
                }).catch(e => {
                    console.error('Error uploading image:', e);
                });
            }
            clearForm();
            if (id) {
                navigate(`/company-detail/${id}`)
            }
        }).catch(e => {
            console.error('Error saving customer:', e);
        });
        // Save logic goes here (e.g., API call)
        console.log('Branch saved:', branch);
    }

    function previewBranch(e) {
        e.preventDefault();
        alert(JSON.stringify(branch, null, 2));
    }

    return (
        <div>
            <div className="container d-block box-shadow">
                <div className='form-header-content px-0 py-3 pt-2'>
                    <div className='d-flex'>
                        <button type="button" className="button cancel box-shadow" onClick={() => navigate('/list-branch')}>
                            <IoIosArrowBack /><span className='px-2'>Cancel</span>
                        </button>
                        <div className="button text-dark">
                            <span className="f-20 border-start ps-3 h-100 w-100 text-secondary">Create Branch</span>
                        </div>
                    </div>
                    <div className='d-flex'>
                        <button type="button" className="button preview box-shadow" onClick={previewBranch}>
                            <i className="fa-solid fa-circle-info px-2"></i>Preview
                        </button>
                        <div className='px-3 pe-0'>
                            <button type="button" className="button add box-shadow px-4" onClick={saveBranch}>
                                <IoSaveSharp /><span className='px-2'>Save</span>
                            </button>
                        </div>
                    </div>
                </div>

                <form>
                    <div className="row">
                        <div className="col-12">
                            <div className='col-xl-6 col-md-6 col-12'>
                                <div className="mb-3">
                                    <div className='w-100'>
                                        <label htmlFor="fileImage" className='rounded py-2 box-shadow center pointer' style={{ height: '150px', width: '300px', overflow: 'hidden' }}>
                                            <img src={selectedImage || '/default-image.png'} alt="Branch" className="h-100" />
                                        </label>
                                    </div>
                                </div>
                                <input type="file" id="fileImage" className='d-none w-100' onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="col-md-6 col-12">
                            <InputValidation
                                label='Branch Name'
                                id='branchName'
                                type='text'
                                name='branchName'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.branchName}
                                error={errors.branchName}
                            />


                            <InputValidation
                                label='Branch Code'
                                id='branchCode'
                                type='text'
                                name='branchCode'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.branchCode}
                                error={errors.branchCode}
                            />

                            <InputValidation
                                label='Address Line 1'
                                id='addressLine1'
                                type='text'
                                name='addressLine1'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.addressLine1}
                                error={errors.addressLine1}
                            />
                            <InputValidation
                                label='Address Line 2'
                                id='addressLine2'
                                type='text'
                                name='addressLine2'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.addressLine2}
                                error={errors.addressLine2}
                            />
                            <InputValidation
                                label='Email'
                                id='email'
                                type='email'
                                name='email'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.email}
                                error={errors.email}
                            />

                            <InputValidation
                                label='Established Date'
                                id='establishedDate'
                                type='date'
                                name='establishedDate'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.establishedDate}
                            />

                        </div>

                        <div className="col-md-6 col-12">
                            <InputValidation
                                label='City'
                                id='city'
                                type='text'
                                name='city'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.city}
                                error={errors.city}
                            />

                            <InputValidation
                                label='State'
                                id='state'
                                type='text'
                                name='state'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.state}
                            />

                            <InputValidation
                                label='Postal Code'
                                id='postalCode'
                                type='text'
                                name='postalCode'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.postalCode}
                                error={errors.postalCode}
                            />

                            <InputValidation
                                label='Country'
                                id='country'
                                type='text'
                                name='country'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.country}
                            />

                            <InputValidation
                                label='Phone Number'
                                id='phoneNumber'
                                type='text'
                                name='phoneNumber'
                                fontSize={14}
                                onChange={handleInputChange}
                                value={branch.phoneNumber}
                                error={errors.phoneNumber}
                            />
                            <CustomCommoBox
                                fontSize={14}
                                items={employee.filter(e => e.managerID == null)}
                                label='Manager'
                                searchKey={'firstName'}
                                labelKeys={['firstName', 'lastName']}
                                onItemSelected={(value) => setBranch(prevData => ({ ...prevData, ['managerId']: value.id }))}
                            />
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchForm;
