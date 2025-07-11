import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import website from '../../website/json/website.json';
import { PiUserCircle } from 'react-icons/pi';
import { FaUser } from 'react-icons/fa';
import { IoIosLock } from 'react-icons/io';
import {
    Avatar,
    Button,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { POSRoute } from '../../website/routes/Routes';
import { POS_POST } from '../../website/service/ApiService';
import { StyleColors, Translate } from '../../website/extension/Extension';
import { useAuth } from './AuthContext';
import { Container } from 'lucide-react';
import './style.css'

const initialValues = {
    username: '',
    password: '',
};

export default function Login() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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
        <>
            <div className='container-fluid position-absolute top-0 left-0 right-0 bottom-0'>
                <div className="position-relative h-100">

                </div>
                <div
                    className="position-absolute top-0 right-0 left-0 h-100  shadow-md d-flex"

                >
                    <div className="w-100 p-3 center rounded-lg" style={{ backgroundColor: "rgba(255,255,255,1)" }}>
                        <div className='start w-full hidden md:flex max-w-[600px]'>
                            <div className='hidden md:block'>
                                <div className='center '>
                                    <Avatar src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s' className="shadow-md" sx={{ width: 150, height: 150 }} />

                                </div>
                                <div className='h3 center py-3' style={{ color: StyleColors.componentsColor }}>
                                    RS Shopping
                                </div>
                                <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?semt=ais_hybrid&w=740" alt="" className="src" />
                            </div>
                        </div>
                        <div className="w-full center" >
                            <div className='max-w-[600px] w-full'>
                                <div className='block md:hidden'>
                                    <div className='center'>
                                        <Avatar src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s' sx={{ width: 150, height: 150 }} />

                                    </div>
                                    <div className='h3 center py-3' style={{ color: StyleColors.componentsColor }}>
                                        RS Shopping
                                    </div>
                                </div>

                                <div className='py-4'>
                                    <p
                                        className=""
                                        style={{ fontSize: '25px' }}
                                    >

                                        {Translate(website.Label.AccountLogin)}

                                    </p>
                                    <p
                                        className="text-gray-500"
                                        style={{ fontSize: '16px' }}
                                    >

                                        Please enter your username and password to login.

                                    </p>
                                </div>

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
                                    {/* Username Field */}
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.username}
                                        sx={{ mb: 2 }}
                                    >
                                        <TextField
                                            label="Username"
                                            name="username"
                                            type="text"
                                            value={values.username}
                                            onChange={handleChange}
                                            error={!!errors.username}
                                            helperText={errors.username}
                                            required
                                            autoComplete="username"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaUser style={{ color: '#e91e63' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#e0e0e0',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#e91e63',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#e91e63',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#e91e63',
                                                    },
                                                },
                                            }}
                                        />
                                    </FormControl>

                                    {/* Password Field */}
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.password}
                                        sx={{ mb: 2 }}
                                    >
                                        <TextField
                                            label="Password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            required
                                            autoComplete="current-password"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IoIosLock style={{ color: '#e91e63', fontSize: '18px' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            sx={{ color: '#e91e63' }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#e0e0e0',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#e91e63',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#e91e63',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#e91e63',
                                                    },
                                                },
                                            }}
                                        />
                                    </FormControl>

                                    <Button
                                        sx={{
                                            background: 'linear-gradient(45deg, #e91e63, #f06292)',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: "white",
                                            padding: '13px 0px',
                                            textTransform: "none",
                                            boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                                                boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)',
                                                boxShadow: '0 2px 10px rgba(233, 30, 99, 0.3)',
                                            },
                                            '&:disabled': {
                                                background: '#f5f5f5',
                                                color: '#bdbdbd',
                                                boxShadow: 'none',
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                        type="submit"
                                        className="w-100 my-3"
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? 'Logging in…'
                                            : Translate({
                                                en: 'Login',
                                                km: 'ចូលគណនី',
                                            })}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}