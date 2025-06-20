import React, { useState } from 'react';
import './style.css';
import TextField from '../../components/text_field/POSTextField';
import { StyleColors, Translate } from '../../extension/Extension';
import website from '../../../website/json/website.json';
import Button from '../../components/Button/Button';
import { IoCartOutline } from 'react-icons/io5';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
};

const GuestOrderForm = ({ onSubmit, onClick }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (fieldValues = values) => {
        const temp = { ...errors };

        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName
                ? ''
                : website.ValidationMessages.FirstNameRequired;

        if ('lastName' in fieldValues)
            temp.lastName = fieldValues.lastName
                ? ''
                : website.ValidationMessages.LastNameRequired;

        if ('email' in fieldValues) {
            temp.email = fieldValues.email
                ? /\S+@\S+\.\S+/.test(fieldValues.email)
                    ? ''
                    : website.ValidationMessages.EmailInvalid
                : website.ValidationMessages.EmailRequired;
        }

        if ('phone' in fieldValues)
            temp.phone = fieldValues.phone
                ? ''
                : website.ValidationMessages.PhoneRequired;

        if ('address' in fieldValues)
            temp.address = fieldValues.address
                ? ''
                : website.ValidationMessages.AddressRequired;

        // ✅ Remove city, postalCode, country from here

        setErrors({ ...temp });
        return Object.values(temp).every(x => x === '');
    };


    const handleChange = e => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        validate({ [name]: value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(validate());
        if (validate()) {
            setSubmitting(true);
            const orderData = { ...values };
            console.log(orderData);

            if (onSubmit) onSubmit(orderData);
            if (onClick) onClick(); // ✅ this makes your log work

            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
        }
    };


    const renderError = errorMsg => (errorMsg ? Translate(errorMsg) : '');

    return (
        <div className="container center rounded p-4 mt-2" style={{ maxWidth: '100%' }}>
            <div className="w-100">
                <p className="center gap-2 pt-1 pb-3" style={{ fontSize: '28px' }}>
                    <IoCartOutline size={28} /> {Translate(website.Label.OrderInformation)}
                </p>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex w-100 gap-2">
                        <TextField
                            label={Translate(website.Label.LabelForm.FirstName)}
                            name="firstName"
                            className="w-100"
                            value={values.firstName}
                            onChange={handleChange}
                            error={renderError(errors.firstName)}
                            prefixIcon="FaRegUserCircle"
                            required
                        />
                        <TextField
                            label={Translate(website.Label.LabelForm.LastName)}
                            name="lastName"
                            className="w-100"
                            value={values.lastName}
                            onChange={handleChange}
                            error={renderError(errors.lastName)}
                            prefixIcon="FaRegUserCircle"
                            required
                        />
                    </div>
                    <TextField
                        label={Translate(website.Label.LabelForm.Email)}
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        error={renderError(errors.email)}
                        prefixIcon="FaAt"
                        required
                    />
                    <TextField
                        label={Translate(website.Label.LabelForm.PhoneNumber)}
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        error={renderError(errors.phone)}
                        prefixIcon="FaPhoneAlt"
                        required
                    />
                    <TextField
                        label={Translate(website.Label.LabelForm.Address)}
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        error={renderError(errors.address)}
                        prefixIcon="FaHome"
                        required
                    />

                    <Button
                        type="button"
                        className="pos-button pos-button--primary w-100 py-3 my-3"
                        style={{
                            background: StyleColors.componentsColor,
                            borderRadius: '10px',
                            fontSize: StyleColors.fontLarge,
                            fontWeight: '400'
                        }}
                        disabled={submitting}
                        onClick={handleSubmit}

                    >
                        {Translate(website.Label.PlaceOrder)}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default GuestOrderForm;
