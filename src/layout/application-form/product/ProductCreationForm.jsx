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
import POSCommobox from '../../../website/components/search_dropdown/POSCommobox';
import CustomCommoBox from '../../../components/select/CustomCommoBox';
import BarcodeTextField from '../../../components/barcode/BarcodeTextField';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const initialValues = {
    category_id: '',
    code: '',
    product_name: '',
    cost_price: '',
    stock: '',
    description: '',
    warehouse_id: '',
    image_url: '',
    group_code: '',
    brand_name: '',
    selling_price: '',
    image_display_group: ''
};

const ProductCreationForm = ({ onSuccess }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (fieldValues = values) => {
        const temp = { ...errors };

        if ('product_name' in fieldValues)
            temp.product_name = fieldValues.product_name ? '' : 'Product name is required.';
        if ('code' in fieldValues)
            temp.code = fieldValues.code ? '' : 'Product code is required.';
        if ('cost_price' in fieldValues)
            temp.cost_price = fieldValues.cost_price ? '' : 'Cost price is required.';
        if ('selling_price' in fieldValues)
            temp.selling_price = fieldValues.selling_price ? '' : 'Selling price is required.';
        if ('stock' in fieldValues)
            temp.stock = fieldValues.stock >= 0 ? '' : 'Stock must be a positive number.';
        if ('category_id' in fieldValues)
            temp.category_id = fieldValues.category_id ? '' : 'Category is required.';
        setErrors({ ...temp });
        return Object.values(temp).every((x) => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setValues({ ...values, [name]: value });
        validate({ [name]: value });
    };
    const uploadImage = (e, name) => {
        console.log(e.target.values);
        const { value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
        validate({ [name]: value });
    };
    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategory(subCategory);
        if (subCategory) {
            setValues({
                ...values,
                category_id: subCategory.id  // Directly use subCategory.id
            });
            validate({ category_id: subCategory.id });
        } else {
            // Handle case when selection is cleared
            setValues({
                ...values,
                category_id: null
            });
            validate({ category_id: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSubmitting(true);
            // Format numeric values before submission
            const submissionData = {
                ...values,
                cost_price: parseFloat(values.cost_price),
                selling_price: parseFloat(values.selling_price),
                stock: parseInt(values.stock),
                created_by: 'current-user-id', // This should come from auth context
                updated_by: 'current-user-id',
                "warehouse_id": null,
                created_date: new Date().toISOString(),
                updated_date: new Date().toISOString()
            };

            const res = POS_POST('v1/products', submissionData)
            res.then((respone) => {
                setTimeout(() => {
                    onSuccess();
                    setSubmitting(false);
                    setValues(initialValues);
                }, 1000);
            }).catch(e => {
                console.log(e)
            })
            // Here you would typically make an API call

        }
    };
    const [categories, setCategories] = useState([]);
    const [selectCategories, setSelectedSubCategory] = useState();
    useEffect(() => {
        getCategories();
    }, [])
    const getCategories = () => {
        const res = POS_GET('v1/categories');
        res.then(r => {
            setCategories(r.data);
        })

    }
    const [barcode, setbarcode] = useState();


    return (
        <div className='container center rounded p-3' style={{ maxWidth: '100%' }}>
            <div className='w-100'>
                <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
                    <div className='row'>
                        {/* First Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Product Name"
                                id="product_name"
                                name="product_name"
                                type="text"
                                value={values.product_name}
                                onChange={handleChange}
                                error={errors.product_name}
                                prefixIcon='FaBoxOpen'
                                required
                            />
                        </div>
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <FileUpload
                                label="Product Image"

                                onChange={(e) => uploadImage(e, "image_url")}
                                cloudName="dml2cm2bm"
                                uploadPreset="NurakPOS"
                            />
                        </div>
                        <div className='col-md-6 col-lg-4 mb-3'>

                            <CustomCommoBox
                                label="Categories"
                                name="category_id"
                                error={errors.category_id}
                                items={categories}
                                required={true}
                                searchKey="name"
                                labelKeys={['name']}
                                onItemSelected={handleSubCategorySelect}
                                fontSize={16}
                                placeholder="Choose subcategory..."
                                defaultValueIndex={selectCategories ? categories.findIndex(item => item.id === selectCategories.id) : -1}
                                top="10px"
                                className="subcategory-select"
                            />

                        </div>





                        {/* Second Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <BarcodeTextField
                                id="barcode-field-1"
                                label="Generate Barcode"
                                value={values.code}
                                onChange={(e) => setValues({ ...values, code: e.target.value })}
                                onBarcodeGenerated={({ text, image }) => {

                                    setValues({ ...values, code: text })
                                }}
                                showBarcodeOnClick={true}
                                size="medium"
                            />
                        </div>

                        {/* Third Column */}
                        {/* <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Category ID"
                                id="category_id"
                                name="category_id"
                                type="text"
                                value={values.category_id}
                                onChange={handleChange}
                                error={errors.category_id}
                                prefixIcon='FaList'
                                required
                            />
                        </div> */}

                        {/* Fourth Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Brand Name"
                                id="brand_name"
                                name="brand_name"
                                type="text"
                                value={values.brand_name}
                                onChange={handleChange}
                                prefixIcon='FaTag'
                            />
                        </div>

                        {/* Fifth Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Cost Price ($)"
                                id="cost_price"
                                name="cost_price"
                                type="number"
                                step="0.01"
                                value={values.cost_price}
                                onChange={handleChange}
                                error={errors.cost_price}
                                prefixIcon='FaDollarSign'
                                required
                            />
                        </div>

                        {/* Sixth Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Selling Price ($)"
                                id="selling_price"
                                name="selling_price"
                                type="number"
                                step="0.01"
                                value={values.selling_price}
                                onChange={handleChange}
                                error={errors.selling_price}
                                prefixIcon='FaDollarSign'
                                required
                            />
                        </div>

                        {/* Seventh Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Stock Quantity"
                                id="stock"
                                name="stock"
                                type="number"
                                value={values.stock}
                                onChange={handleChange}
                                error={errors.stock}
                                prefixIcon='FaBoxes'
                                required
                            />
                        </div>

                        {/* Ninth Column */}
                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Group Code"
                                id="group_code"
                                name="group_code"
                                type="text"
                                value={values.group_code}
                                onChange={handleChange}
                                prefixIcon='FaCodeBranch'
                            />
                        </div>



                        <div className='col-md-6 col-lg-4 mb-3'>
                            <TextField
                                label="Display Group Image URL"
                                id="image_display_group"
                                name="image_display_group"
                                type="url"
                                value={values.image_display_group}
                                onChange={handleChange}
                                prefixIcon='FaImages'
                                fullWidth
                            />
                        </div>

                        <div className='col-md-12 col-lg-8 mb-3'>
                            <TextField
                                label="Description"
                                id="description"
                                name="description"
                                type="textarea"
                                value={values.description}
                                onChange={handleChange}
                                prefixIcon='FaAlignLeft'
                                rows={3}
                                fullWidth
                            />
                        </div>
                    </div>




                    <div className='flex end'>
                        <div className=''>
                            <Button
                                sx={{ textTransform: 'none', fontWeight: '400', '&:hover': { backgroundColor: StyleColors.appBackground }, color: StyleColors.componentsColor }}
                                startIcon={<CheckCircleIcon sx={{ color: StyleColors.componentsColor }} />}
                                type="submit"
                                variant='text'
                                color='inherit'

                                disabled={submitting}
                            >
                                {submitting ? 'Creating...' : Translate(website.Label.CreateProduct)}
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductCreationForm;