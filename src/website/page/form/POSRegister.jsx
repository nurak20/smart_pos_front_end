import React, { useState } from 'react';
import './style.css';
import TextField from '../../components/text_field/POSTextField';
import { StyleColors, Translate } from '../../extension/Extension';
import website from '../../../website/json/website.json'
import Button from '../../components/Button/Button';
import { IoPersonAddOutline } from "react-icons/io5";
import { PiUserCircle } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { POSRoute, WEBRoute } from '../../routes/Routes';

const initialValues = {
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
};

const RegisterForm = () => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (fieldValues = values) => {
        const temp = { ...errors };
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? '' : 'Full name is required.';
        if ('phone' in fieldValues)
            temp.phone = fieldValues.phone ? '' : 'phone is required.';

        if ('password' in fieldValues)
            temp.password =
                fieldValues.password.length >= 6
                    ? ''
                    : 'Password must be at least 6 characters.';
        if ('confirmPassword' in fieldValues)
            temp.confirmPassword =
                fieldValues.confirmPassword === values.password
                    ? ''
                    : 'Passwords do not match.';
        setErrors({ ...temp });
        return Object.values(temp).every((x) => x === '');
    };

    const handleChange = (e) => {

        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        validate({ [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSubmitting(true);
            // simulate API call
            setTimeout(() => {
                alert('Registered successfully!');
                setSubmitting(false);
                setValues(initialValues);
            }, 1000);
        }
    };

    return (
        <div className='container center shadow-sm rounded p-4 mt-2' style={{ maxWidth: '600px', }}>
            <div className='w-100'>
                <p className='center gap-2 pt-1 pb-3' style={{ fontSize: '30px', }}>
                    <IoPersonAddOutline size={30} /> {
                        Translate(website.Label.AccountRegister)
                    }
                </p>
                <form style={{ width: '100%', }} onSubmit={handleSubmit} noValidate>
                    <TextField

                        label="Full Name"
                        className="w-100"
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={values.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        prefixIcon='FaRegUserCircle'
                        required
                    />

                    <TextField

                        label="Phone Number"
                        className="w-100"
                        id="phone"
                        name="phone"
                        type="text"
                        value={values.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        prefixIcon='FaRegUserCircle'
                        required
                    />
                    <TextField
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        typeIcon='io'
                        prefixIcon='IoIosLock'
                        suffixIcon='IoMdEye'
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        typeIcon='io'
                        prefixIcon='IoIosLock'
                        suffixIcon='IoMdEye'
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                    />
                    <Button
                        style={{ background: StyleColors.componentsColor, borderRadius: '10px' }}
                        type="submit"
                        className="pos-button pos-button--primary w-100 py-3 my-3"
                        disabled={submitting}
                    >
                        {
                            Translate(website.Label.Submit)
                        }
                    </Button>

                    <Link to={POSRoute.login} className='text-center center' style={{ fontSize: StyleColors.fontMedium, }}>
                        {
                            Translate(website.Label.AlreadyHaveAccount)
                        }
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
