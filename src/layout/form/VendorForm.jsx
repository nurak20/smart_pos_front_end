import React, { useEffect, useState } from 'react';
import InputValidation from '../../components/input/InputValidation';
import { hostName } from '../../api/host';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '../../api/ImageApi';
import { createVendor, updateVendor, getVendor } from '../../api/Vendor';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSaveSharp } from 'react-icons/io5';
import { Button } from '@mui/material';

const VendorForm = () => {
    const [vendor, setVendor] = useState(
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

    const domainName = hostName();
    const vendorImagePath = `http://${domainName}:8085/api/images/`;
    const { id } = useParams();
    const [errors, setErrors] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (id) {
            getVendor(id).then(response => {
                setVendor({
                    displayName: response.data.displayName,
                    companyName: response.data.companyName,
                    email: response.data.email,
                    phone: response.data.phone,
                    address: response.data.address,
                    active: response.data.active,
                    image: response.data.image
                });
            }).catch(e => {
                console.error('Error fetching vendor:', e);
            });
        }
    }, [id]);

    function validateForm() {
        const newErrors = {};
        if (!vendor.displayName) newErrors.name = 'Name is required';
        if (!vendor.email) newErrors.email = 'Email is required';
        if (!vendor.companyName) newErrors.companyName = 'Company name is required';
        if (!vendor.phone) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setVendor(prevData => ({ ...prevData, [name]: value }));
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const imageURL = URL.createObjectURL(file);
        setSelectedImage(imageURL);
        setFile(file);
        setVendor(prevData => ({ ...prevData, image: file.name }));
    };

    function clearForm() {
        setFile(null);
        setSelectedImage(null);
        setVendor({
            "displayName": "",
            "companyName": "",
            "email": "",
            "phone": "",
            "address": "",
            "active": true
        });
    }

    function saveVendor(e) {
        e.preventDefault();
        if (!validateForm()) return;

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            uploadImage(formData).then(() => {
                console.log('Image uploaded successfully');
            }).catch(e => {
                console.error('Error uploading image:', e);
            });
        }

        const apiCall = id ? updateVendor(id, vendor) : createVendor(vendor);
        apiCall.then(() => {
            console.log(`${id ? 'Vendor updated' : 'Vendor created'} successfully`);
            clearForm();
        }).catch(e => {
            console.error('Error saving vendor:', e);
        });
        if (id) navigate('/list-vendor')
    }

    function previewVendor(e) {
        e.preventDefault();
        alert(JSON.stringify(vendor, null, 2));
    }

    const navigate = useNavigate();

    return (
        <div>
            <div className="container d-block box-shadow">
                {/* <h2 className="text-center py-3">
                    Create Vendor
                    <p className="f-10">create new vendor with validation form</p>
                </h2> */}
                <div className='form-header-content px-0 py-3 pt-2'>

                    <div className='d-flex'>
                        <Button variant='outlined' color='error' type="button" className="py-2 " onClick={() => navigate('/list-vendor')}>
                            <IoIosArrowBack /><span className='px-2'>Cancel</span>
                        </Button>
                        <div className="button text-dark">
                            <span className="f-20 border-start ps-3 h-100 w-100 text-secondary">
                                {id ? 'Update Vendor' : 'Create Vendor'}
                            </span>
                        </div>
                    </div>
                    <div className='d-flex'>
                        <Button variant='contained' color='secondary' type="button" className="py-2 " onClick={previewVendor}>
                            <i className="fa-solid fa-circle-info px-2"></i>Preview
                        </Button>
                        <div className='px-3 pe-0'>
                            <Button variant='contained' color='primary' type="button" className="py-2 " onClick={saveVendor}>
                                <IoSaveSharp /><span className='px-2'>Save</span>
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
                                                <img src={selectedImage ? selectedImage : `${vendorImagePath}${vendor.image}`} alt="Vendor" className="h-100" />
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
                                    label='CompanyName'
                                    id='companyName'
                                    type='text'
                                    name='companyName'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={vendor.companyName}
                                    error={errors.companyName}
                                />
                                <InputValidation
                                    label='Vendor Name'
                                    id='vendorName'
                                    type='text'
                                    name='displayName'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={vendor.displayName}
                                    error={errors.name}
                                />

                                <InputValidation
                                    label='Phone'
                                    id='vendorPhone'
                                    type='text'
                                    name='phone'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={vendor.phone}
                                    error={errors.phone}
                                />


                            </div>
                            <div className="col-md-6 col-12">

                                <InputValidation
                                    label='Email'
                                    id='vendorEmail'
                                    type='email'
                                    name='email'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={vendor.email}
                                    error={errors.email}
                                />

                                <InputValidation
                                    label='Address'
                                    id='vendorAddress'
                                    type='text'
                                    name='address'
                                    fontSize={14}
                                    onChange={handleInputChange}
                                    value={vendor.address}
                                />

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorForm;
