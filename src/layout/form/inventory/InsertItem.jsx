
import { getOrderByID } from '../../../api/Order'
import { listOrderLineByOrderID } from '../../../api/Order'
import { useEffect, useState } from 'react'
import { Form, useParams } from 'react-router-dom'
import { createProduct, updateProduct } from '../../../api/Product'
import { getProductById } from '../../../api/Product'
import { getAllBranch } from '../../../api/Branch'
import { useNavigate } from 'react-router-dom'
import { getAllCategory } from '../../../api/Category'
import axios from 'axios'
import './itemform.css'
import { uploadImage } from '../../../api/ImageApi'
import { IoSaveSharp } from 'react-icons/io5'
import { IoIosArrowRoundBack } from 'react-icons/io'
import InputValidation from '../../../components/input/InputValidation'
import SelectBox from '../../../components/select/SelectBox'
import { getDefualtUserId } from '../../../api/AppConfig'
import { hostName } from '../../../api/host'
import CustomCommoBox from '../../../components/select/CustomCommoBox'
import Tabs from '../../../components/tabs/Tabs'
const InsertItem = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategory().then((response) => {
            setCategories(response.data);
        }).catch(e => {
            console.error(e);
        })
    }, [])
    const domainName = hostName();
    const productImage = `http://${domainName}:8085/api/images/`
    const user = getDefualtUserId();
    const [productData, setProductData] = useState({
        createdBy: user,
        updatedBy: user,
        categoryId: '',
        branchId: '',
        productCode: '',
        productName: '',
        price: '',
        prepareTime: '',
        description: '',
        calories: '',
        status: 1,
        productOrigin: '',
        sugar: '',
        image: '',
        maxOrderQty: '',
        minOrderQty: '',
        createdDate: new Date(),
        updatedDate: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('Choose Category');
    const [branchName, setBranchName] = useState('Choose Branch');
    const [branch, setBranch] = useState([]);
    useEffect(() => {
        getAllBranch().then((response) => {
            setBranch(response.data);
            console.log("Branch" + response.data)
        }).catch(e => {
            console.error(e);
        })
    }, [])
    const [selectedImage, setSelectedImage] = useState(null);


    function submitProduct() {

        if (!user) {
            return
        }
        if (!file) {
            if (!productData.image) {
                return
            }
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Use the `uploadImage` function to send the file
            // const response = await uploadImage(formData);
            uploadImage(formData).then((response) => {
                setMessage("Create Product Successfull");
                alert('Success');
            })
        } catch (error) {
            // Handle errors and display appropriate messages
            setMessage(
                error.response?.data || "Error uploading file. Please try again."

            );

        }

        if (id) {
            updateProduct(id, productData).then((respone) => {
                console.log(respone.data);
                setProductData({
                    createdBy: '',
                    updatedBy: '',
                    categoryId: '',
                    branchId: '',
                    productCode: '',
                    productName: '',
                    price: '',
                    prepareTime: '',
                    description: '',
                    calories: '',
                    status: 1,
                    productOrigin: '',
                    sugar: '',
                    image: '',
                    maxOrderQty: '',
                    minOrderQty: '',
                    createdDate: new Date(),
                    updatedDate: ''
                });
                navigate(`/item-detail/${id}`);
            }).catch(e => {
                console.error(e);
            })
            return
        }

        createProduct(productData).then((response) => {
            alert('Success');
            setProductData({
                createdBy: user,
                updatedBy: user,
                categoryId: '',
                branchId: '',
                productCode: '',
                productName: '',
                price: '',
                prepareTime: '',
                description: '',
                calories: '',
                status: 1,
                productOrigin: '',
                sugar: '',
                image: '',
                maxOrderQty: '',
                minOrderQty: '',
                createdDate: new Date(),
                updatedDate: ''
            });
        })

    }
    function preview(e) {
        e.preventDefault();
        if (!user) {
            return
        }
        const jsonString = JSON.stringify(productData, null, 2); // 'null, 2' formats the JSON for readability

        alert(jsonString)
    }

    useEffect(() => {
        if (id) {

            getProductById(id).then((reponse) => {
                setProductData((prevData) => ({
                    ...prevData,
                    ["productName"]: reponse.data.productName,
                    ["productCode"]: reponse.data.productCode,
                    ["price"]: reponse.data.price,
                    ["prepareTime"]: reponse.data.prepareTime,
                    ["description"]: reponse.data.description,
                    ["calories"]: reponse.data.calories,
                    ["status"]: reponse.data.status,
                    ["productOrigin"]: reponse.data.productOrigin,
                    ["sugar"]: reponse.data.sugar,
                    ["image"]: reponse.data.image,
                    ["maxOrderQty"]: reponse.data.maxOrderQty,
                    ["minOrderQty"]: reponse.data.minOrderQty,
                    ["createdDate"]: reponse.data.createdDate,
                    ["updatedDate"]: reponse.data.updatedDate,
                    ["createdBy"]: reponse.data.createdBy,
                    ["categoryId"]: reponse.data.categoryId,
                    ["branchId"]: reponse.data.branchId,
                }));
            })

        }
    }, [id])

    const [file, setFile] = useState(null); // State to store the selected file
    const [message, setMessage] = useState(""); // State to display messages

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        const f = event.target.files[0];
        if (!f) {
            return
        }
        if (f) {
            const imageURL = URL.createObjectURL(f);
            setSelectedImage(imageURL); // Create a URL for the selected file
        }
        setProductData((prevData) => ({
            ...prevData,
            ["image"]: event.target.files[0].name
        }));
    };

    function formHeader() {
        return (
            <div className='form-header-content px-0 py-3 pt-2'>
                <div className='d-flex'>
                    <button type="button" class="button cancel box-shadow " onClick={() => navigate('/list-item')}><IoIosArrowRoundBack /><span className='px-2'>Cancel</span> </button>
                    <div className="button text-dark"><span className="f-20 border-start ps-3 h-100 w-100 text-secondary">{id ? 'Update Product' : 'Create Product'}</span></div>
                </div>
                <div className='d-flex'>
                    <button type="button" class="button preview box-shadow " onClick={preview}><i class="fa-solid fa-circle-info px-2"></i>Preview </button>
                    <div className='px-3 pe-0'>
                        <button type="button" class="button add box-shadow px-4" onClick={submitProduct}><IoSaveSharp /><span className='px-2'>Save</span> </button>
                    </div>
                </div>


            </div>
        );
    }
    const handleInputChange = (field, value) => {
        setProductData((prev) => ({ ...prev, [field]: value }));
    };
    const steps = [
        {
            label: "Product Basics",
            content: (errors) => (
                <>
                    <CustomCommoBox
                        fontSize={15}
                        label="Category"
                        items={categories} // Assuming you have a list of categories
                        searchKey={['name']}
                        labelKeys={['name']}
                        defaultValueIndex={categories.findIndex(c => c.id == productData.categoryId)}
                        onItemSelected={(value) => handleInputChange("categoryId", value.id)}
                        error={errors.categoryId}
                    />
                    <CustomCommoBox
                        fontSize={15}
                        label="Company"
                        items={branch} // Assuming you have a list of categories
                        searchKey={['branchName']}
                        labelKeys={['branchName', 'addressLine1']}
                        defaultValueIndex={branch.findIndex(b => b.id == productData.branchId)}
                        onItemSelected={(value) => handleInputChange("branchId", value.id)}
                        error={errors.branchId}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Product Name"
                        id="productName"
                        type="text"
                        onChange={(e) => handleInputChange("productName", e.target.value)}
                        value={productData.productName}
                        error={errors.productName}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Price"
                        id="price"
                        type="number"
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        value={productData.price}
                        error={errors.price}
                    />

                    <InputValidation
                        fontSize={15}
                        label="Product Origin"
                        id="productOrigin"
                        type="text"
                        onChange={(e) => handleInputChange("productOrigin", e.target.value)}
                        value={productData.productOrigin}
                        error={errors.productOrigin}
                    />

                    <InputValidation
                        fontSize={15}
                        label="Prepare Time"
                        id="prepareTime"
                        type="number"
                        onChange={(e) => handleInputChange("prepareTime", e.target.value)}
                        value={productData.prepareTime}
                        error={errors.prepareTime}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Calories"
                        id="calories"
                        type="number"
                        onChange={(e) => handleInputChange("calories", e.target.value)}
                        value={productData.calories}
                        error={errors.calories}
                    />
                </>
            ),
            validate: () => {
                const errors = {};
                if (!productData.productName) {
                    errors.productName = "Product Name is required.";
                }
                if (!productData.categoryId) {
                    errors.categoryId = "Category is required.";
                }
                if (!productData.branchId) {
                    errors.branchId = "Company is required.";
                }
                if (!productData.price) {
                    errors.price = "Price is required.";
                }
                return errors;
            },
        },
        {
            label: "Upload Image",
            content: (errors) => (
                <>
                    <div className='w-100'>
                        <label htmlFor="fileImage" className=' rounded py-2 box-shadow center pointer' style={{ height: '200px', width: '300px', overflow: 'hidden' }}>
                            <img src={selectedImage ? selectedImage : `${productImage}${productData.image}`} alt="" className="h-100 " />
                        </label> <br />
                        <span className='validation-error f-12'>{errors.image ? errors.image : ''}</span>
                    </div>
                    <input type="file" name="" className='d-none w-100' id="fileImage"
                        // onChange={(e) => {
                        //     setProductData((prevData) => ({
                        //         ...prevData,
                        //         ["image"]: e.target.files[0].name
                        //     }));
                        // }}
                        onChange={handleFileChange}
                    />

                    <InputValidation
                        fontSize={15}
                        label="Image URL"
                        id="image"
                        type="text"
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        value={productData.image}
                        error={errors.image}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Description"
                        id="description"
                        type="textarea"
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        value={productData.description}
                    />
                </>
            ),
            validate: () => {
                const errors = {};
                if (!productData.image) {
                    errors.image = "Product Image is required.";
                }
                if (!productData.description) {
                    errors.description = "Product Description is required.";
                }
                return errors;
            },
        },
        {
            label: "Review & Submit",
            content: () => (
                <div>
                    <h3>Review the Product</h3>
                    <pre>{JSON.stringify(productData, null, 2)}</pre>

                </div>
            ),
            validate: () => ({}), // No validation needed for this step
        },
    ];

    return (
        <>

            <div className='p-3'>


                <div className="container d-block center box-shadow bg-white">
                    {/* {formHeader()} */}


                    {/* <div className="row w-100">
                        <div className="col-xl-12">
                            <div className="bg-white w-100 rounded">
                                <div className='row'>
                                    <div className='col-xl-6 col-md-6 col-12'>
                                        <div className="d-flex">
                                            <div className='w-100'>
                                                <label htmlFor="fileImage" className=' rounded py-2 box-shadow center pointer' style={{ height: '200px', width: '300px', overflow: 'hidden' }}>
                                                    <img src={selectedImage ? selectedImage : `${productImage}${productData.image}`} alt="" className="h-100 " />
                                                </label> <br />
                                                <span className='validation-error f-12'>{errors.image ? errors.image : ''}</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='col-6 pb-3'>
                                        <div className='d-none'>

                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-xl-6 col-lg-6 col-sm-12 col-12'>
                                        <div className=''>
                                            <InputValidation
                                                label="Product Name"
                                                id="p-name"
                                                onChange={handleInputChange}
                                                name={'productName'}
                                                value={productData.productName}
                                                error={errors.productName}
                                                fontSize={14}
                                                require={'true'}
                                            />
                                            <InputValidation
                                                label="Product Code"
                                                id="p-code"
                                                onChange={handleInputChange}
                                                name={'productCode'}
                                                value={productData.productCode}
                                                require={'true'}
                                                fontSize={14}
                                            />
                                            <InputValidation
                                                label="Selling Price"
                                                id="price"
                                                onChange={handleInputChange}
                                                name={'price'}
                                                type={'number'}
                                                value={productData.price}
                                                fontSize={14}
                                            />
                                            <InputValidation
                                                label="MaxOrderQty"
                                                type={'number'}
                                                id="maxQty"
                                                onChange={handleInputChange}
                                                name={'maxOrderQty'}
                                                value={productData.maxOrderQty}
                                                fontSize={14}
                                                error={errors.maxOrderQty}
                                                require={'true'}
                                            />
                                            <InputValidation
                                                label="MinOrderQty"
                                                type={'number'}
                                                id="minQty"
                                                onChange={handleInputChange}
                                                name={'minOrderQty'}
                                                value={productData.minOrderQty}
                                                fontSize={14}
                                                error={errors.minOrderQty}
                                                require={'true'}
                                            />
                                            <InputValidation
                                                label="ProductOrigin"
                                                type={'text'}
                                                id="productOrigin"
                                                onChange={handleInputChange}
                                                name={'productOrigin'}
                                                value={productData.productOrigin}
                                                fontSize={14}

                                            />

                                        </div>


                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-sm-12 col-12 '>
                                        <div className="">

                                            <CustomCommoBox
                                                fontSize={14}
                                                label='Select Category'
                                                items={categories}
                                                searchKey='name'
                                                labelKeys={['name']}
                                                onItemSelected={selectCategory}
                                                error={errors.category}
                                            />
                                            <CustomCommoBox
                                                fontSize={14}
                                                label='Select Branch'
                                                items={branch}
                                                searchKey='branchName'
                                                labelKeys={['branchName', 'address']}
                                                onItemSelected={selectBranch}
                                                error={errors.branch}
                                            />
                                        </div>


                                    </div>
                                </div>
                                <div className='bg-white py-3'>
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="text-dark nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Cooking</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button class="text-dark nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Note</button>
                                        </li>

                                    </ul>
                                    <div class="tab-content border-0" id="myTabContent">
                                        <div class="border-0 tab-pane show active " id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                                            <div className="d-flex">
                                                <div className='d-block text-start fs-6 bg-white py-2 w-75'>
                                                    <InputValidation
                                                        label="prepareTime"
                                                        id="prepareTime"
                                                        type={"number"}
                                                        onChange={handleInputChange}
                                                        name={'prepareTime'}
                                                        value={productData.prepareTime}
                                                        error={errors.prepareTime}
                                                        fontSize={14}
                                                    />
                                                    <InputValidation
                                                        label="Calories"
                                                        id="calories"
                                                        type={"number"}
                                                        onChange={handleInputChange}
                                                        name={'calories'}
                                                        value={productData.calories}
                                                        error={errors.calories}
                                                        fontSize={14}
                                                    />
                                                    <InputValidation
                                                        label="Sugar"
                                                        id="sugar"
                                                        type={"number"}
                                                        onChange={handleInputChange}
                                                        name={'sugar'}
                                                        value={productData.sugar}
                                                        error={errors.sugar}
                                                        fontSize={14}
                                                    />


                                                </div>

                                            </div>
                                        </div>
                                        <div class="border-0 tab-pane p-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                                            <textarea
                                                className='border-0 input-box w-100 p-2 f-14'
                                                placeholder='New Note'
                                                name='description'
                                                value={productData.description}
                                                onChange={handleInputChange}
                                            />

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <h2 className="text-center py-3">
                        {id ? 'Update Product' : 'Create Product'}
                        <p className="f-10">
                            {id ? 'update product formation' : 'create new product with validation form'}
                        </p>
                    </h2>
                    <Tabs steps={steps} onSave={() => submitProduct()} />

                </div>
            </div >

        </>
    )
}





export default InsertItem
