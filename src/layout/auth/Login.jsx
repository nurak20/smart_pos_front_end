import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import website from '../../website/json/website.json';
import { PiUserCircle } from 'react-icons/pi';
import { Button } from '@mui/material';
import { POSRoute } from '../../website/routes/Routes';
import TextField from '../../website/components/text_field/POSTextField';
import { POS_POST } from '../../website/service/ApiService';
import { StyleColors, Translate } from '../../website/extension/Extension';
import { useAuth } from './AuthContext';

const initialValues = {
    username: '',
    password: '',
};

export default function Login() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Get the intended destination or default to home
    const from = location.state?.from?.pathname || POSRoute.home;

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
        // Clear server error when user starts typing
        if (serverError) setServerError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setSubmitting(true);
        try {
            const response = await POS_POST('auth/login', values);

            // Use the auth context to handle login
            const loginSuccess = login(response);

            if (loginSuccess) {
                // Navigate to intended destination or dashboard based on role
                const user = response.data.user;
                const roles = response.data.authorization.roles;

                if (roles.includes('admin')) {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setServerError('Failed to save login data. Please try again.');
            }
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
                        className="alert alert-danger text-center"
                        style={{
                            color: 'red',
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            border: '1px solid #f5c6cb',
                            borderRadius: '0.375rem',
                            backgroundColor: '#f8d7da'
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
                        autoComplete="username"
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
                        autoComplete="current-password"
                    />

                    <Button
                        style={{
                            background: StyleColors.componentsColor,
                            borderRadius: '10px',
                            color: "white",
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