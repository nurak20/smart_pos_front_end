import React, { useEffect, useState } from 'react';
import InputValidation from '../../components/input/InputValidation';
import { hostName } from '../../api/host';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '../../api/ImageApi';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSaveSharp } from 'react-icons/io5';
import { createCustomer, getCustomer, updateCustomer } from '../../api/Customer';
import { Button } from '@mui/material';

const CreateCustomer = () => {
    const [customer, setCustomer] = useState({
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

    const domainName = hostName();
    const customerImagePath = `http://${domainName}:8085/api/images/`;
    const { id } = useParams();
    const [errors, setErrors] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (id) {
            getCustomer(id).then(response => {
                setCustomer(response.data);
            }).catch(e => {
                console.error('Error fetching customer:', e);
            });
        }
    }, [id]);

    function validateForm() {
        const newErrors = {};
        if (!customer.firstName) newErrors.firstName = 'First name is required';
        if (!customer.lastName) newErrors.lastName = 'Last name is required';
        if (!customer.email) newErrors.email = 'Email is required';
        if (!customer.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setCustomer(prevData => ({ ...prevData, [name]: value }));
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const imageURL = URL.createObjectURL(file);
        setSelectedImage(imageURL);
        setFile(file);
        setCustomer(prevData => ({ ...prevData, ['image']: file.name }));
    };

    function clearForm() {
        setFile(null);
        setSelectedImage(null);
        setCustomer({
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
        if (id) {
            navigate('/customer-detail/' + id);
        }
    }

    function saveCustomer(e) {
        e.preventDefault();
        if (!validateForm()) return;



        const apiCall = id ? updateCustomer(id, customer) : createCustomer(customer);
        apiCall.then(() => {
            console.log(`${id ? 'Customer updated' : 'Customer created'} successfully`);
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

        }).catch(e => {
            console.error('Error saving customer:', e);
        });
    }

    function previewCustomer(e) {
        e.preventDefault();
        alert(JSON.stringify(customer, null, 2));
    }

    const navigate = useNavigate();

    return (
        <div>
            <div className="container d-block box-shadow">
                <div className='form-header-content px-0 py-3 pt-2'>
                    <div className='d-flex'>
                        <Button variant='outlined' color='error' className='py-2' onClick={() => navigate('/list-customer')}>
                            <IoIosArrowBack /><span className='px-2'>Cancel</span>
                        </Button >
                        <div className="button text-dark">
                            <span className="f-20 border-start ps-3 h-100 w-100 text-secondary">
                                {id ? 'Update Customer' : 'Create Customer'}
                            </span>
                        </div>
                    </div>
                    <div className='d-flex'>
                        <Button startIcon={<i className="fa-solid fa-circle-info px-2"></i>} variant='contained' color='secondary' type="button" className='py-2' onClick={previewCustomer}>
                            Preview
                        </Button>
                        <div className='px-3 pe-0'>
                            <Button startIcon={<IoSaveSharp />} variant='contained' color='primary' type="button" className='py-2' onClick={saveCustomer}>
                                <span className='px-2'>Save</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <form>
                    <div>
                        <div className="row">
                            <div className="col-12">
                                <div className='col-xl-6 col-md-6 col-12'>
                                    <div className="d-flex">
                                        <div className='w-100'>
                                            <label htmlFor="fileImage" className='rounded py-2 box-shadow center pointer' style={{ height: '150px', width: '150px', overflow: 'hidden' }}>
                                                <img src={selectedImage ? selectedImage : `${customerImagePath}${customer.image}`} alt="Customer" className="h-100" />
                                            </label>
                                            <span className='validation-error f-12'>{errors.image || ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6 pb-3'>
                                    <div className='d-none'>
                                        <input type="file" id="fileImage" className='d-none w-100' onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-12">
                                <InputValidation
                                    label='First Name'
                                    id='firstName'
                                    type='text'
                                    name='firstName'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.firstName}
                                    error={errors.firstName}
                                />
                                <InputValidation
                                    label='Last Name'
                                    id='lastName'
                                    type='text'
                                    name='lastName'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.lastName}
                                    error={errors.lastName}
                                />
                                <InputValidation
                                    label='Phone Number'
                                    id='phoneNumber'
                                    type='text'
                                    name='phoneNumber'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.phoneNumber}
                                    error={errors.phoneNumber}
                                />
                                <InputValidation
                                    label='Email'
                                    id='email'
                                    type='email'
                                    name='email'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.email}
                                    error={errors.email}
                                />

                                <InputValidation
                                    label='Country'
                                    id='country'
                                    type='text'
                                    name='country'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.country}
                                    error={errors.country}
                                />

                            </div>
                            <div className="col-md-6 col-12">

                                <InputValidation
                                    label='Address Line 1'
                                    id='addressLine1'
                                    type='text'
                                    name='addressLine1'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.addressLine1}
                                />
                                <InputValidation
                                    label='Address Line 2'
                                    id='addressLine2'
                                    type='text'
                                    name='addressLine2'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.addressLine2}
                                />
                                <InputValidation
                                    label='Postal Code'
                                    id='postalCode'
                                    type='text'
                                    name='postalCode'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.postalCode}
                                    error={errors.postalCode}
                                />
                                <InputValidation
                                    label='City'
                                    id='city'
                                    type='text'
                                    name='city'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.city}
                                    error={errors.city}
                                />
                                <InputValidation
                                    label='State'
                                    id='state'
                                    type='text'
                                    name='state'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={customer.state}
                                    error={errors.state}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCustomer;
