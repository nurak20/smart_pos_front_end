import React, { useEffect, useState } from 'react';
import website from '../../../website/json/website.json';
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import TextField from '../../../website/components/text_field/POSTextField';
import { StyleColors, Translate } from '../../../website/extension/Extension';
import { POSRoute } from '../../../website/routes/Routes';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Button } from '@mui/material';
import { POS_GET, POS_POST } from '../../../website/service/ApiService';
import FileUpload from '../../../website/components/text_field/FileUpload';

const initialValues = {
    name: '',
    description: '',
    image: '',
    status: true
};

const CategoryCreationForm = () => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (fieldValues = values) => {
        const temp = { ...errors };

        if ('name' in fieldValues)
            temp.name = fieldValues.name ? '' : 'Category name is required.';
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? '' : 'Description is required.';

        setErrors({ ...temp });
        return Object.values(temp).every((x) => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        validate({ [name]: value });
    };

    const handleStatusChange = (e) => {
        setValues({ ...values, status: e.target.checked });
    };

    const uploadImage = (e, name) => {
        const { value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
        validate({ [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSubmitting(true);

            const submissionData = {
                ...values,
                created_by: 'current-user-id', // This should come from auth context
                updated_by: 'current-user-id',
                created_date: new Date().toISOString(),
                updated_date: new Date().toISOString()
            };

            const res = POS_POST('v1/categories', submissionData)
            res.then((response) => {
                setTimeout(() => {
                    alert('Category created successfully!');
                    setSubmitting(false);
                    setValues(initialValues);
                }, 1000);
            }).catch(e => {
                console.log(e);
                setSubmitting(false);
            });
        }
    };

    return (
        <div className='container center rounded p-3' style={{ maxWidth: '100%' }}>
            <div className='w-100'>
                <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
                    <div className='row'>
                        {/* First Column */}
                        <div className='col-md-6 col-lg-6 mb-3'>
                            <TextField
                                label="Category Name"
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onChange={handleChange}
                                error={errors.name}
                                prefixIcon='FaBoxOpen'
                                required
                            />
                        </div>

                        {/* Second Column */}
                        <div className='col-md-6 col-lg-6 mb-3'>
                            <FileUpload
                                label="Category Image"
                                onChange={(e) => uploadImage(e, "image")}
                                cloudName="dml2cm2bm"
                                uploadPreset="NurakPOS"
                            />
                        </div>

                        {/* Third Column */}
                        {/* <div className='col-md-6 col-lg-4 mb-3'>
                            <div className="form-check form-switch d-flex align-items-center">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="status"
                                    checked={values.status}
                                    onChange={handleStatusChange}
                                    style={{ width: '3em', height: '1.5em' }}
                                />
                                <label className="form-check-label ms-2" htmlFor="status">
                                    Active Status
                                </label>
                            </div>
                        </div> */}

                        {/* Fourth Column - Full width description */}
                        <div className='col-12 col-lg-12 mb-3'>
                            <TextField
                                label="Description"
                                id="description"
                                name="description"
                                type="textarea"
                                value={values.description}
                                onChange={handleChange}
                                error={errors.description}
                                prefixIcon='FaAlignLeft'
                                rows={4}
                                fullWidth
                                required
                            />
                        </div>
                    </div>

                    <div className='flex end'>
                        <div className=''>
                            <Button
                                style={{ background: StyleColors.componentsColor }}
                                type="submit"
                                className="pos-button pos-button--primary w-100 my-3 py-2 text-light px-3"
                                disabled={submitting}
                            >
                                {submitting ? 'Creating...' : Translate(website.Label.Submit)}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryCreationForm;