// src/pages/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';
import { StyleColors, Translate } from '../../extension/Extension';
import website from '../../../website/json/website.json';
import Button from '../../components/Button/Button';
import TextField from '../../components/text_field/POSTextField';
import { PiUserCircle } from 'react-icons/pi';
import { POSRoute } from '../../routes/Routes';
import { POS_POST } from '../../service/ApiService';
import Cookies from 'js-cookie';

const initialValues = {
    username: '',
    password: '',
};

export default function LoginForm() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // client-side field validation
    const validate = (fieldVals = values) => {
        const temp = { ...errors };
        if ('username' in fieldVals) {
            temp.username = fieldVals.username
                ? ''
                : 'Username is required.';
        }
        if ('password' in fieldVals) {
            temp.password =
                fieldVals.password.length >= 6
                    ? ''
                    : 'Password must be at least 6 characters.';
        }
        setErrors(temp);
        return Object.values(temp).every((x) => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        validate({ [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setSubmitting(true);
        try {
            const res = await POS_POST(
                'auth/login',
                values
            );
            Cookies.set('access_token', JSON.stringify(res.meta.token));
            navigate(POSRoute.home);
        } catch (err) {
            const msg =
                err?.data?.message ||
                err.message ||
                'Login failed. Please try again.';
            setServerError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="container center shadow-sm rounded p-4 mt-2"
            style={{ maxWidth: '600px' }}
        >
            <div className="w-100">
                <p
                    className="center gap-2 pt-1 pb-3"
                    style={{ fontSize: '30px' }}
                >
                    <PiUserCircle size={30} />{' '}
                    {Translate(website.Label.AccountLogin)}
                </p>

                {serverError && (
                    <div
                        style={{
                            color: 'red',
                            marginBottom: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        {serverError}
                    </div>
                )}

                <form
                    style={{ width: '100%' }}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <TextField
                        label="Username"
                        name="username"
                        type="text"
                        value={values.username}
                        onChange={handleChange}
                        prefixIcon="FaUser"
                        error={errors.username}
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        prefixIcon="IoIosLock"
                        suffixIcon="IoMdEye"
                        error={errors.password}
                        required
                    />

                    <Button
                        style={{
                            background: StyleColors.componentsColor,
                            borderRadius: '10px',
                        }}
                        type="submit"
                        className="pos-button pos-button--primary w-100 py-3 my-3"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Logging in…'
                            : Translate(website.Label.Submit)}
                    </Button>

                    <div className="text-center">
                        <Link
                            to={POSRoute.register}
                            style={{ fontSize: StyleColors.fontMedium }}
                        >
                            {Translate(website.Label.AccountRegister)}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
