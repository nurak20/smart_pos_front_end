import { useState } from "react";
import { getEmployee, newEmployee, updateEmployee } from "../../api/EmployeeApi";
import { getAllBranch } from "../../api/Branch";
import { useEffect } from "react";
import { getAllEmployee } from "../../api/EmployeeApi";
import { json, useNavigate, useParams } from "react-router-dom";
import { IoSaveSharp } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import InputValidation from "../../components/input/InputValidation";
import { uploadImage } from "../../api/ImageApi";
import { hostName } from "../../api/host";
import CustomCommoBox from "../../components/select/CustomCommoBox";
import Tabs from "../../components/tabs/Tabs";
import { Button, Paper } from "@mui/material";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PDFViewer from "../pdf/PDFViewer";

const CreateEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        lastName: '',
        firstName: '',
        schedule: '',
        workShiftID: '',
        managerID: '',
        cv: '',
        positionID: '',
        companyID: '',
        resume: '',
        dayOff: '',
        email: '',
        mobile: '',
        gender: '',
        salary: '',
        address: '',
        bankAccount: '',
        contact: '',
        startWorkingDate: '',
        createdDate: new Date(),
        updatedDate: '',
        image: ''
    });
    const [employee, setEmployee] = useState([]);
    const [branchName, setBranchName] = useState('select branch');
    const [branch, setBranch] = useState([]);
    useEffect(() => {
        getAllBranch().then((response) => {
            setBranch(response.data);
            console.log("Branch" + response.data)
        }).catch(e => {
            console.error(e);
        })
        getAllEmployee().then((response) => {
            setEmployee(response.data);
        }).catch(e => {
            console.error(e);
        })
    }, [])
    const manager = employee.filter(e => e.managerID == null);
    const { id } = useParams();
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
    };
    useEffect(() => {
        if (id) {
            getEmployee(id).then((reponse) => {
                setEmployeeData((prevData) => ({
                    ...prevData,
                    ["lastName"]: reponse.data.lastName,
                    ["firstName"]: reponse.data.firstName,
                    ["schedule"]: reponse.data.schedule,
                    ["workShiftID"]: reponse.data.workShiftID,
                    ["managerID"]: reponse.data.managerID,
                    ["cv"]: reponse.data.cv,
                    ["positionID"]: reponse.data.positionID,
                    ["companyID"]: reponse.data.companyID,
                    ["resume"]: reponse.data.resume,
                    ["dayOff"]: reponse.data.dayOff,
                    ["email"]: reponse.data.email,
                    ["mobile"]: reponse.data.mobile,
                    ["gender"]: reponse.data.gender,
                    ["salary"]: reponse.data.salary,
                    ["address"]: reponse.data.address,
                    ["bankAccount"]: reponse.data.bankAccount,
                    ["contact"]: reponse.data.contact,
                    ["startWorkingDate"]: formatDate(reponse.data.startWorkingDate),
                    ["createdDate"]: reponse.data.createdDate,
                    ["updatedDate"]: new Date(),
                    ["image"]: reponse.data.image,
                }));
                // alert(reponse.data.image)

            }).catch(e => {
                console.error(e);
            })
        }
    }, [id])

    const domainName = hostName();
    const profilePath = `http://${domainName}:8085/api/images/`
    function findBranchName(id) {
        try {
            return branch.find(b => b.id == id).branchName;
        } catch (e) {
            return "No Branch Selected"
        }
    }
    function findManager(id) {
        try {
            return employee.find(e => e.id == id).firstName + ' ' + employee.find(e => e.id == id).lastName;
        } catch (e) {
            return "No Manager Selected"
        }
    }

    const navigate = useNavigate();

    function selectBranch(branch) {
        setEmployeeData((prevData) => ({
            ...prevData,
            ['companyID']: branch.id
        }));
    }
    function selectManager(manager) {
        setEmployeeData((prevData) => ({
            ...prevData,
            ['managerID']: manager.id
        }));
    }
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEmployeeData((prevData) => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };
    // using error check if error lenth bigger than zero is error on another field
    // const [errors, setErrors] = useState({});
    // // validation field
    // const validateEmployeeForm = () => {
    //     const newErrors = {};

    //     if (!employeeData.lastName) {
    //         newErrors.lastName = 'Last Name is required.';
    //     }

    //     if (!employeeData.firstName) {
    //         newErrors.firstName = 'First Name is required.';
    //     }

    //     if (!id) {
    //         if (!employeeData.managerID) {
    //             newErrors.managerID = 'Manager ID is required.';
    //         }
    //     }

    //     // if (!employeeData.positionID) {
    //     //     newErrors.positionID = 'Position ID is required.';
    //     // }

    //     if (!employeeData.companyID) {
    //         newErrors.companyID = 'Company ID is required.';
    //     }


    //     if (!employeeData.email) {
    //         newErrors.email = 'Email is required.';
    //     } else if (!/^\S+@\S+\.\S+$/.test(employeeData.email)) {
    //         newErrors.email = 'Invalid Email format.';
    //     }

    //     if (!employeeData.mobile) {
    //         newErrors.mobile = 'Mobile Number is required.';
    //     } else if (!/^\d{8,15}$/.test(employeeData.mobile)) {
    //         newErrors.mobile = 'Mobile Number must be between 8 and 15 digits.';
    //     }

    //     if (!employeeData.gender) {
    //         newErrors.gender = 'Gender is required.';
    //     }

    //     if (!employeeData.salary) {
    //         newErrors.salary = 'Salary is required.';
    //     } else if (isNaN(employeeData.salary) || employeeData.salary <= 0) {
    //         newErrors.salary = 'Salary must be a positive number.';
    //     }

    //     if (!employeeData.address) {
    //         newErrors.address = 'Address is required.';
    //     }



    //     if (!employeeData.image) {
    //         newErrors.image = 'Image is required.';
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0; // Returns true if no errors
    // };
    const [selectedImage, setSelectedImage] = useState();
    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        // set file select from path
        setFile(event.target.files[0]);
        const f = event.target.files[0];
        if (!f) {
            return
        }
        if (f) {
            const imageURL = URL.createObjectURL(f);
            setSelectedImage(imageURL); // Create a URL for the selected file
        }
        // set image name to store in database
        setEmployeeData((prevData) => ({
            ...prevData,
            ["image"]: event.target.files[0].name
        }));
    };


    function saveEmployee() {
        // e.preventDefault();
        // update employee
        if (id) {
            updateEmployee(id, employeeData).then((response) => {
                setEmployeeData(
                    {
                        lastName: '',
                        firstName: '',
                        schedule: '',
                        workShiftID: '',
                        managerID: '',
                        cv: '',
                        positionID: '',
                        companyID: '',
                        resume: '',
                        dayOff: '',
                        email: '',
                        mobile: '',
                        gender: '',
                        salary: '',
                        address: '',
                        bankAccount: '',
                        contact: '',
                        startWorkingDate: '',
                        createdDate: new Date(),
                        updatedDate: '',
                        image: ''
                    }
                )
                navigate(`/employee-detail/${id}`)
            }).catch(e => {
                return
            })
        }
        alert('')
        // add employee
        newEmployee(employeeData).then((response) => {
            console.log(response.data);
            navigate('/employees');
        }).catch(error => {
            return
        })
        // upload file to folder project backend
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                // Use the `uploadImage` function to send the file
                // const response = await uploadImage(formData);
                uploadImage(formData).then((response) => {
                    setMessage("Create Product Successfull");
                    alert('knaskldnl')
                })
            } catch (error) {
                return
            }
        }
        if (pdfFile) {
            const formData = new FormData();
            formData.append("file", pdfFile);
            try {
                // Use the `uploadImage` function to send the file
                // const response = await uploadImage(formData);
                uploadImage(formData).then((response) => {
                    setMessage("Create Product Successfull");
                    alert('knaskldnl')
                })
            } catch (error) {
                return
            }
        }
    }

    // preveiew employee data JSON alert
    function preview(e) {
        e.preventDefault();
        const jsonString = JSON.stringify(employeeData, null, 2); // 'null, 2' formats the JSON for readability

        alert(jsonString)
    }

    const handleInputChange = (field, value) => {
        setEmployeeData((prev) => ({ ...prev, [field]: value }));
    };
    const managerIndex = manager.findIndex(m => {
        const managerEmployee = employee.find(emp => emp.id === employeeData.managerID);
        return managerEmployee && m.firstName === managerEmployee.firstName;
    });

    console.log(managerIndex);
    const [pdfFile, setPdfFile] = useState(null);

    const handlePDFFileChange = (e) => {
        const file = e.target.files[0];
        setEmployeeData((prev) => ({ ...prev, ['cv']: file.name }));
        setPdfFile(file);
    };

    const steps = [
        {
            label: "Personal Information",
            content: (errors) => (
                <>
                    <InputValidation
                        fontSize={15}
                        label="Last Name"
                        id="lastName"
                        type="text"
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        value={employeeData.lastName}
                        error={errors.lastName}
                    />
                    <InputValidation
                        fontSize={15}
                        label="First Name"
                        id="firstName"
                        type="text"
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        value={employeeData.firstName}
                        error={errors.firstName}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Email"
                        id="email"
                        type="email"
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        value={employeeData.email}
                        error={errors.email}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Mobile"
                        id="mobile"
                        type="text"
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        value={employeeData.mobile}
                        error={errors.mobile}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Gender"
                        id="gender"
                        type="text"
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        value={employeeData.gender}
                        error={errors.gender}
                    />
                </>
            ),
            validate: () => {
                const errors = {};
                if (!employeeData.lastName) {
                    errors.lastName = "Last Name is required.";
                }
                if (!employeeData.firstName) {
                    errors.firstName = "First Name is required.";
                }
                if (!employeeData.email) {
                    errors.email = "Email is required.";
                }
                if (!employeeData.mobile) {
                    errors.mobile = "Mobile is required.";
                }
                if (!employeeData.gender) {
                    errors.gender = "Gender is required.";
                }
                return errors;
            },
        },
        {
            label: "Employment Details",
            content: (errors) => (
                <>
                    {/* <CustomCommoBox
                        fontSize={15}
                        label="Work Shift"
                        items={workShifts} // Assuming you have a list of work shifts
                        searchKey={['name']}
                        labelKeys={['name']}
                        onItemSelected={(value) => handleInputChange("workShiftID", value.id)}
                        error={errors.workShiftID}
                    /> */}
                    <CustomCommoBox
                        fontSize={15}
                        label="Manager"
                        items={employee} // Assuming you have a list of managers
                        searchKey="firstName"
                        defaultValueIndex={employee.findIndex(e => e.id == employeeData.managerID)}
                        labelKeys={["firstName", "lastName"]}
                        onItemSelected={(value) => handleInputChange("managerID", value ? value.id : null)}
                        error={errors.managerID}
                    />


                    <CustomCommoBox
                        fontSize={14}
                        label='Select Branch'
                        items={branch}
                        searchKey='branchName'
                        defaultValueIndex={branch.findIndex(b => b.id == employeeData.companyID)}
                        labelKeys={['branchName']}
                        onItemSelected={(value) => handleInputChange("companyID", value.id)}
                        error={errors.companyID}
                    />

                    {/* <CustomCommoBox
                        fontSize={15}
                        label="Position"
                        items={positions} // Assuming you have a list of positions
                        searchKey={['name']}
                        labelKeys={['name']}
                        onItemSelected={(value) => handleInputChange("positionID", value.id)}
                        error={errors.positionID}
                    /> */}
                    <InputValidation
                        fontSize={15}
                        label="Salary"
                        id="salary"
                        type="number"
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        value={employeeData.salary}
                        error={errors.salary}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Start Working Date"
                        id="startWorkingDate"
                        type="date"
                        onChange={(e) => handleInputChange("startWorkingDate", e.target.value)}
                        value={employeeData.startWorkingDate}
                        error={errors.startWorkingDate}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Bank Account"
                        id="bankAccount"
                        type="text"
                        onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                        value={employeeData.bankAccount}
                        error={errors.bankAccount}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Contact"
                        id="contact"
                        type="text"
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        value={employeeData.contact}
                        error={errors.contact}
                    />
                    <InputValidation
                        fontSize={15}
                        label="Address"
                        id="address"
                        type="text"
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        value={employeeData.address}
                        error={errors.address}
                    />
                    {/* <InputValidation
                        fontSize={15}
                        label="Manager ID"
                        id="managerID"
                        type="number"
                        onChange={(e) => handleInputChange("managerID", e.target.value)}
                        value={employeeData.managerID}
                        error={errors.managerID}
                    /> */}
                </>
            ),
            validate: () => {
                const errors = {};
                if (!employeeData.companyID) {
                    errors.companyID = "Branch is required.";
                }
                if (!employeeData.bankAccount) {
                    errors.bankAccount = "Bank Account is required.";
                }
                if (!employeeData.contact) {
                    errors.contact = "Contact is required.";
                }
                if (!employeeData.address) {
                    errors.address = "Address is required.";
                }
                return errors;
            },
        },
        {
            label: "Upload Resume & Image",
            content: (errors) => (
                <>
                    <div className="w-100">
                        <label
                            htmlFor="fileImage"
                            className="rounded py-2 box-shadow center pointer"
                            style={{ height: "200px", width: "300px", overflow: "hidden" }}
                        >
                            <img
                                src={selectedImage || `http://${domainName}:8085/api/images/${employeeData.image}`}
                                alt="Profile"
                                className="h-100"
                            />
                        </label>
                        <span className="validation-error f-12">{errors.image ? errors.image : ""}</span>
                    </div>
                    <input
                        type="file"
                        id="fileImage"
                        className="d-none"
                        onChange={handleFileChange}
                    />

                    <InputValidation
                        fontSize={15}
                        label="Resume URL"
                        id="resume"
                        type="text"
                        onChange={(e) => handleInputChange("resume", e.target.value)}
                        value={employeeData.resume}
                        error={errors.resume}
                    />
                </>
            ),
            validate: () => {
                const errors = {};
                return errors;
            },
        },
        {
            label: "Upload Resume & Image",
            content: (errors) => (
                <>
                    <div>
                        <Button className="w-100 py-3" variant="contained" color="inherit">
                            <label htmlFor="pdfFile" className="w-100">SELECT SV</label>
                        </Button>
                        <input type="file" className="d-none" onChange={handlePDFFileChange} id="pdfFile" />
                        {/* {pdfFile && (
                            <div style={{ height: '600px' }}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={URL.createObjectURL(pdfFile)} />
                                </Worker>
                            </div>
                        )} */}
                        {pdfFile ?
                            <div style={{ height: '600px' }}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={URL.createObjectURL(pdfFile)} />
                                </Worker>
                            </div> :
                            employeeData.cv ? <PDFViewer path={`http://${domainName}:8085/api/images/pdf/${employeeData.cv}`} /> : ''
                        }
                        {/* {
                            employeeData.cv ? <P
                        } */}
                    </div>
                </>
            ),
            validate: () => {
                const errors = {};
                return errors;
            },
        },
        {
            label: "Review & Submit",
            content: () => (
                <div>
                    <h3>Review Employee Information</h3>
                    <pre>{JSON.stringify(employeeData, null, 2)}</pre>
                </div>
            ),
            validate: () => ({}), // No validation needed for this step
        },
    ];

    return (
        <>

            <form action="" className="p-3">

                <div className="container box-shadow rounded  d-block p-3">
                    <h2 className="text-center py-3">
                        Create Employee
                        <p className="f-10">create new employee with validation form</p>
                    </h2>

                    <Tabs steps={steps} onSave={() => saveEmployee()} />

                </div>
            </form>

        </>
    )
}





export default CreateEmployee
