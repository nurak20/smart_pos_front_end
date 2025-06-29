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
        <div
            className="container center shadow-sm rounded p-4 mt-2 bg-white"
            style={{ maxWidth: '600px' }}
        >
            <div className="w-100">
                <p className="center gap-2 pt-1 pb-3" style={{ fontSize: '30px' }}>
                    <PiUserCircle size={30} /> Edit User Profile
                </p>

                {/* Profile Image Preview */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
                        <img
                            src={values.image_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>
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

                <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
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

                    <div className="between">
                        <Button
                            variant='text'
                            sx={{
                                fontWeight: '400',
                                textTransform: 'none',
                                color: "red"
                            }}
                            endIcon={<CloseIcon />}
                            type="button"
                            className="py-3"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant='text'
                            sx={{
                                fontWeight: '400',
                                textTransform: 'none',
                                color: StyleColors.componentsColor
                            }}
                            endIcon={<DoneIcon />}
                            type="submit"
                            className="py-3"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}