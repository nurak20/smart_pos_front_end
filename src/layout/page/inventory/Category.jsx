import { Link } from 'react-router-dom'
import './item.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { deleteCategoryById, getAllCategory } from '../../../api/Category'
import { DataGrid, Tbody, Td, Th, Thead, Tr } from '../../../components/table/DataGrid'
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge } from "react-icons/fa";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import { RiEditFill } from 'react-icons/ri'
import RemoveMessage from '../../../components/alert/RemoveMessage'
import { hostName } from '../../../api/host'
import DataList from '../../../components/datalist/DataList'
import { motion } from 'framer-motion'
import ActionHeader from '../../../components/listheader/ActionHeader'
import { exportToExcelFiles, perPage, searchData } from '../../../api/AppConfig'
import { getAllProduct } from '../../../api/Product'
import { Avatar, AvatarGroup, Paper } from '@mui/material'
import ED from '../../../components/editRemoveAction/ED'

const Category = () => {

    const [employee, setEmployee] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState([]);
    const domainName = hostName();
    const IMG_BEST_URL = `http://${domainName}:8085/api/images/`;
    const categoryPathImage = `http://${domainName}:8085/api/images/`;
    useEffect(() => {
        getCategory();
    }, [])
    const rowVariants = {
        hidden: { opacity: 0, X: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05, // Stagger animation by 0.1 seconds per row
            },
        }),
    };
    function getCategory() {
        getAllCategory().then((response) => {
            setCategories(response.data);
        }).catch(e => {
            console.error(e);
        })
        getAllProduct().then((reponse) => {
            setProduct(reponse.data);
        })
    }
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...categories].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setCategories(sortedData);
    };
    const goto = useNavigate();
    function listCard() {
        return (
            <div className="row w-100">
                {
                    categories.map(o =>
                        <div className="col-xl-4 col-sm-12">
                            <div className="card border-0 bg-white p-0 border-3 pointer mb-2 box-shadow inv-card"
                                onClick={() => goto(`/customer-detail`)}
                                style={{ height: '150px' }}
                            >
                                <div className="card-body p-0 inv-card rounded ">
                                    <div className="d-flex">
                                        <div className="w-25 start ">
                                            <div className="center rounded box-shadow" style={{ height: '150px', overflow: 'hidden' }}>
                                                <img src={o.image} alt="" className='h-100 rounded' />
                                            </div>
                                        </div>
                                        <div className='font-12 w-75 ps-4 py-3'>
                                            <div className='fs-5'>{o.name}</div>
                                            <div className='font-12 text-secondary'>{o.description} min</div>
                                            <div className='text-start'>12 Product</div>

                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
    const [rowsPerPage, setRowsPerPage] = useState(15);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = categories.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(categories.length / rowsPerPage);

    // Handle Next and Previous button clicks
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getCategory();
            return
        }
        setCategories(searchData(categories, searchTerm, ["name", "description"]));

    }, [searchTerm]);
    const [isRemoveCategories, setIsRemoveCategories] = useState(false);
    const [categoryId, setCategoryId] = useState();
    function removeCategroy(id) {
        deleteCategoryById(id).then((reponse) => {
            getCategory()
        }).catch(e => {
            alert(e);
        })
    }
    function listTable() {


        return (
            <>
                <DataGrid>
                    <table>
                        <Thead>
                            <Th columnWidth={20}>
                                <input type="checkbox" name="" className="rounded-0 border px-3" id="" />
                            </Th>
                            <Th
                                onSort={() => handleSort("id")}
                                sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""}
                                columnWidth={50}
                            >
                                No
                            </Th>
                            <Th
                                onSort={() => handleSort("name")}
                                sortDirection={
                                    sortConfig.key === "name" ? sortConfig.direction : ""
                                }
                                resizable
                                columnWidth={100}
                            >
                                Category
                            </Th>
                            <Th
                                onSort={() => handleSort("description")}
                                sortDirection={
                                    sortConfig.key === "description" ? sortConfig.direction : ""
                                }
                                resizable
                            >
                                Product
                            </Th>
                            <Th columnWidth={30}>
                                Action
                            </Th>
                        </Thead>
                        <Tbody>
                            {currentData.map((f, i) => (
                                <motion.tr
                                    key={f.id}
                                    className='pointer'
                                    custom={i} // Pass index for staggered delay
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Td>
                                        <input
                                            type="checkbox"
                                            name=""
                                            className="rounded-0 border px-3"
                                            id=""
                                        />
                                    </Td>
                                    <Td className="py-3">{startIndex + i + 1}</Td>
                                    <Td>
                                        <div className="d-flex start">
                                            <div className="" style={{ height: '40px' }}>
                                                <img src={`${categoryPathImage}${f.image}`} alt="" className="h-100" />
                                            </div>
                                            <div className='ps-3'>
                                                <span>{f.name}</span> <br />
                                                <span className='f-10'>{f.description}</span>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>
                                        <AvatarGroup
                                            spacing="medium"
                                            max={5}
                                            sx={{
                                                justifyContent: "start", // Align avatars to the start
                                                "& .MuiAvatar-root": {
                                                    marginLeft: "-8px", // Adjust the overlap or spacing between avatars
                                                },
                                            }}
                                        >
                                            {product.map((p) => {
                                                if (p.categoryId == f.id) {
                                                    return (
                                                        <Avatar
                                                            key={p.id} // Add a unique key for each Avatar
                                                            alt={p.name || "Product Avatar"} // Add a descriptive alt text
                                                            src={`${IMG_BEST_URL}${p.image}`}
                                                        />
                                                    );
                                                }
                                            })}
                                        </AvatarGroup>


                                    </Td>
                                    <td>
                                        <ED
                                            deleteClick={() => {
                                                setCategoryId(f.id);
                                                setIsRemoveCategories(true);
                                            }}
                                            updateClick={() => navigate(`/update-category/${f.id}`)}
                                        />
                                    </td>
                                </motion.tr>
                            ))}
                        </Tbody>
                    </table>
                </DataGrid>
                {/* Pagination Controls */}

            </>
        );
    }

    const navigate = useNavigate();


    return (
        <>
            <div className='container-fluid p-0 center'>
                <div className="row">
                    <div className=''>
                        <ActionHeader
                            btnAddName='New Categories'
                            title="Category"
                            subtitle="Manage your categories inventory"
                            searchTerm={searchTerm}
                            searchChange={(e) => setSearchTerm(e.target.value)}
                            onCreate={() => navigate('/create-category')}
                            onPrint={() => setIsPrint(true)}
                            onExport={() => exportToExcelFiles(categories, 'category_data')}
                            perPage={perPage()}
                            selectPerPage={selectPerPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handleNext={handleNext}
                            handlePrevious={handlePrevious}
                        // isTableAction={() => isTable ? setIsTable(false) : setIsTable(true)}
                        />
                    </div>
                    <div className=" col-12">
                        {listTable()}
                    </div>

                </div>
            </div>
            <RemoveMessage
                isOpen={isRemoveCategories}
                message='Are you sure ?'
                description='A confirmation message is intended to prompt users before proceeding with a delete action. It clearly informs them of the irreversible nature of the deletion to prevent accidental loss of data or content.'
                cancelClcik={() => setIsRemoveCategories(false)}
                acceptedClick={() => {
                    removeCategroy(categoryId)
                    setIsRemoveCategories(false)
                }}
            />
        </>
    )
}

export default Category


