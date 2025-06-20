import React, { useEffect, useState } from 'react'
import InputValidation from '../../../components/input/InputValidation';
import { hostName } from '../../../api/host';
import { json, useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '../../../api/ImageApi';
import { createCategory, updateCategory } from '../../../api/Category';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSaveSharp } from 'react-icons/io5';
import { getCategoryById } from '../../../api/Category';
import { Button } from '@mui/material';
const CategoriesForm = () => {
    const [categories, setCategories] = useState(
        {
            "name": '',
            "description": '',
            "image": ''
        }
    )

    const domainName = hostName();
    const categoriesImagePath = `http://${domainName}:8085/api/images/`
    const { id } = useParams()
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        getCategoryById(id).then((response) => {
            setCategories((prevData) => ({
                ...prevData,
                ["name"]: response.data.name,
                ["description"]: response.data.description,
                ["image"]: response.data.image,

            }));
        }).catch(e => {

        })
    }, [id])
    function validation() {
        const newErrors = {}
        if (!categories.name) {
            newErrors.name = 'Name is require'
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length == 0;
    }
    function handleInputChange(e) {
        const { name, value } = e.target;

        setCategories((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null); // State to store the selected file
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
        setCategories((prevData) => ({
            ...prevData,
            ["image"]: event.target.files[0].name
        }));
    };
    function clear() {
        setFile(null)
        setSelectedImage(null);
        setCategories({
            "name": '',
            "description": '',
            "image": ''
        })
    }
    // save data
    function saveCategories(e) {

        e.preventDefault();
        if (!validation()) {
            return
        }

        // updload image to folder backend
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            uploadImage(formData).then((response) => {
                // sucess

            }).catch(e => {

            })
        }
        if (id) {
            updateCategory(id, categories).then((response) => {
                // sucess
                clear()
            }).catch(e => {

            })
            return
        }
        createCategory(categories).then((reponse) => {
            // success
            clear()
        }).catch(e => {

        })
    }
    function preview(e) {
        e.preventDefault();
        alert(JSON.stringify(categories, null, 2));
    }
    const navigate = useNavigate();
    function formHeader() {
        return (
            <div className='form-header-content px-0 py-3 pt-2'>
                <div className='d-flex'>
                    <Button variant='outlined' color='error' onClick={() => navigate('/list-category')}><IoIosArrowBack /><span className='px-2'>Cancel</span> </Button>
                    <div className="button text-dark"><span className="f-20 border-start ps-3 h-100 w-100 text-secondary">{id ? 'Update Category' : 'Create Category'}</span></div>
                </div>
                <div className='d-flex'>
                    <Button variant='contained' color='secondary' onClick={preview}><i class="fa-solid fa-circle-info px-2"></i>Preview </Button>
                    <div className='px-3 pe-0'>
                        <Button variant='contained' color='primary' onClick={saveCategories}><IoSaveSharp /><span className='px-2'>Save</span> </Button>
                    </div>
                </div>


            </div>
        );
    }
    // Form Create Categories
    function form() {
        return (
            <>
                <form>
                    <div>
                        <div className="row">
                            {/* // select image  */}
                            <div className="col-12">
                                <div className='col-xl-6 col-md-6 col-12'>
                                    <div className="d-flex">
                                        <div className='w-100 mt-3'>
                                            <label htmlFor="fileImage" className=' rounded py-2 box-shadow center pointer' style={{ height: '150px', width: '150px', overflow: 'hidden' }}>
                                                <img src={selectedImage ? selectedImage : `${categoriesImagePath}${categories.image}`} alt="" className="h-100 " />
                                            </label> <br />
                                            <span className='validation-error f-12'>{errors.image ? errors.image : ''}</span>
                                        </div>

                                    </div>
                                </div>
                                <div className='col-6 pb-3'>
                                    <div className='d-none'>
                                        <input type="file" name="" className='d-none w-100' id="fileImage"
                                            // onChange={(e) => {
                                            //     setProductData((prevData) => ({
                                            //         ...prevData,
                                            //         ["image"]: e.target.files[0].name
                                            //     }));
                                            // }}
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                </div>
                            </div>
                            {/* // input  */}
                            <div className="col-12 col-12">
                                <div className="">
                                    <InputValidation
                                        label='Categories name '
                                        id='categoriesName'
                                        type='text'
                                        name='name'
                                        fontSize={14}
                                        onChange={handleInputChange}
                                        value={categories.name}
                                        error={errors.name}
                                    />
                                    <InputValidation
                                        label='Description '
                                        id='Description'
                                        type='text'
                                        name='description'
                                        fontSize={14}
                                        onChange={handleInputChange}
                                        value={categories.description}
                                        error={errors.description}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </>
        )
    }
    return (
        <div>
            <div className="container d-block box-shadow">
                {/* <h2 className="text-center py-3">
                    Create Product
                    <p className="f-10">create new product with validation form</p>
                </h2> */}
                {formHeader()}
                {form()}
            </div>

        </div>
    )
}

export default CategoriesForm
