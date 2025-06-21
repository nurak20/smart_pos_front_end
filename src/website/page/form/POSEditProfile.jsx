import React, { useState, useEffect } from 'react';
import './style.css';
import TextField from '../../components/text_field/POSTextField';
import { StyleColors, Translate } from '../../extension/Extension';
import website from '../../../website/json/website.json';
import Button from '../../components/Button/Button';
import { PiUserCircle } from 'react-icons/pi';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
};

const EditProfileForm = ({ user }) => {
    const [values, setValues] = useState(initialValues);
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setValues({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
            if (user.profileImage) {
                setPreview(user.profileImage);
            }
        }
    }, [user]);

    useEffect(() => {
        if (!profileImage) {
            setPreview(user?.profileImage || '');
            return;
        }
        const objectUrl = URL.createObjectURL(profileImage);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [profileImage, user]);

    const validate = (fieldValues = values) => {
        const temp = { ...errors };
        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName ? '' : 'First name is required.';
        if ('lastName' in fieldValues)
            temp.lastName = fieldValues.lastName ? '' : 'Last name is required.';
        if ('email' in fieldValues) {
            temp.email = fieldValues.email ? '' : 'Email is required.';
            if (fieldValues.email)
                temp.email = /\S+@\S+\.\S+/.test(fieldValues.email)
                    ? ''
                    : 'Email is not valid.';
        }
        setErrors({ ...temp });
        return Object.values(temp).every((x) => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        validate({ [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSubmitting(true);
            // prepare form data if uploading image
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('email', values.email);
            if (profileImage) formData.append('profileImage', profileImage);
            // simulate API call to update profile
            setTimeout(() => {
                alert('Profile updated successfully!');
                setSubmitting(false);
            }, 1000);
        }
    };

    return (
        <div className="container center shadow-sm rounded p-4 mt-2" style={{ maxWidth: '600px' }}>
            <div className="w-100">
                <p className="center gap-2 pt-1 pb-3" style={{ fontSize: '30px' }}>
                    <PiUserCircle size={30} /> {Translate(website.Label.EditProfile)}
                </p>
                <div className="center mb-3">
                    {preview ? (
                        <label htmlFor='select-image'>
                            <div style={{ width: '200px', height: '200px', borderRadius: '20px', overflow: 'hidden' }}>
                                <img src={preview} alt="Profile Preview" className="h-100" />
                            </div>
                        </label>

                    ) : (
                        <label htmlFor='select-image'>
                            <div className='hover:shadow-sm pointer' style={{ width: '200px', height: '200px', borderRadius: '20px', overflow: 'hidden' }}>
                                <img src={'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg'} alt="Profile Preview" className="h-100" />
                            </div>
                        </label>

                    )}
                </div>
                <div className="center mb-3 d-none">
                    <input
                        id='select-image'
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control-file"
                    />
                </div>

                <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        prefixIcon="FaRegUserCircle"
                        error={errors.firstName}
                        required
                    />
                    <TextField
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        prefixIcon="FaRegUserCircle"
                        error={errors.lastName}
                        required
                    />
                    <TextField
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        prefixIcon="FaAt"
                        error={errors.email}
                        required
                    />
                    <Button
                        style={{ background: StyleColors.componentsColor, borderRadius: '10px' }}
                        type="submit"
                        className="pos-button pos-button--primary w-100 py-3 my-3"
                        disabled={submitting}
                    >
                        {Translate(website.Label.Submit)}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;
