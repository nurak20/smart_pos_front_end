import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PiUserCircle } from 'react-icons/pi';
import { Button } from '@mui/material';
import { StyleColors, Translate } from '../../website/extension/Extension';
import TextField from '../../website/components/text_field/POSTextField';
import { POS_POST, POS_PUT } from '../../website/service/ApiService';
import { useAuth } from '../auth/AuthContext';
import AuthService from '../auth/AuthService';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';


const initialValues = {
    first_name: '',
    last_name: '',
    image_url: '',
};

export default function EditUserProfile({ userData, onSuccess, onCancel }) {
    const [values, setValues] = useState(userData || initialValues);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, checkAuthStatus } = useAuth();

    // client-side field validation
    const validate = (fieldVals = values) => {
        const temp = { ...errors };
        if ('first_name' in fieldVals) {
            temp.first_name = fieldVals.first_name ? '' : 'First name is required.';
        }
        if ('last_name' in fieldVals) {
            temp.last_name = fieldVals.last_name ? '' : 'Last name is required.';
        }
        if ('image_url' in fieldVals) {
            temp.image_url = fieldVals.image_url ? '' : 'Image URL is required.';
        }
        setErrors(temp);
        return Object.values(temp).every((x) => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        validate({ [name]: value });
        if (serverError) setServerError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setSubmitting(true);
        try {
            const response = await POS_PUT(`users/${user.user_id}`, values);
            if (response) {
                AuthService.saveUserData(response);
                checkAuthStatus();
                onSuccess();
            } else {
                setServerError('Failed to update user. Please try again.');
            }
        } catch (err) {
            const msg =
                err?.data?.message ||
                err.message ||
                'Update failed. Please try again.';
            setServerError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-pink-500 px-4 py-3">
                    <div className="flex items-center gap-2 text-white">
                        <PiUserCircle size={3} />
                        <h1 className="text-base font-medium">Edit Profile</h1>
                    </div>
                </div>

                <div className="p-4">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200">
                            <img
                                src={values.image_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {serverError && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-3">
                        <TextField
                            label="First Name"
                            name="first_name"
                            type="text"
                            value={values.first_name}
                            onChange={handleChange}
                            prefixIcon="FaUser"
                            error={errors.first_name}
                            required
                        />

                        <TextField
                            label="Last Name"
                            name="last_name"
                            type="text"
                            value={values.last_name}
                            onChange={handleChange}
                            prefixIcon="FaUser"
                            error={errors.last_name}
                            required
                        />

                        <TextField
                            label="Image URL"
                            name="image_url"
                            type="url"
                            value={values.image_url}
                            onChange={handleChange}
                            prefixIcon="FaImage"
                            error={errors.image_url}
                            required
                        />

                        {/* Buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button
                                variant='outlined'
                                sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    borderColor: '#e5e7eb',
                                    color: '#6b7280'
                                }}
                                type="button"
                                onClick={onCancel}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant='contained'
                                sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    backgroundColor: '#ec4899',
                                    '&:hover': {
                                        backgroundColor: '#db2777'
                                    }
                                }}
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
    );
}