import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllJournal } from '../../../api/JournalE';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { FaPlus, FaSearch, FaPrint, FaFileExport, FaFilter, FaThList, FaThLarge } from "react-icons/fa";
import { Th } from '../../../components/table/DataGrid';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { exportToExcelFiles, globleRowVariants, perPage, searchData } from '../../../api/AppConfig';
import ActionHeader from '../../../components/listheader/ActionHeader';
import { motion } from 'framer-motion';
import { getAllEmployee } from '../../../api/EmployeeApi';
import { getAllVendor } from '../../../api/Vendor';
import { IoIosArrowRoundDown } from 'react-icons/io';
const Journal = () => {

    const [journal, setJounal] = useState([])
    useEffect(() => {
        getJournal();
    }, [])
    function getJournal() {
        getAllJournal().then((response) => {
            setJounal(response.data);
        }).catch(e => {
            console.error(e);
        })
    }
    const [employee, setEmployee] = useState([]);
    const [vendor, setVendor] = useState([]);
    function getPartner() {
        getAllVendor().then((reponse) => {
            setVendor(reponse.data);
        }).catch(e => {

        })
        getAllEmployee().then((reponse) => {
            setEmployee(reponse.data)
        }).catch(e => {

        })
    }
    useEffect(() => {
        getPartner();
    }, [])
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getJournal();
            return
        }
        setJounal(searchData(journal, searchTerm, ["reference", "id", "partnerId"]));

    }, [searchTerm]);

    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en', {
            weekday: 'long',   // Full day of the week (e.g., "Monday")
            day: '2-digit',    // Two-digit day (e.g., "07")
            month: 'numeric',     // Full month name (e.g., "November")
            year: 'numeric'    // Full year (e.g., "2024")
        }).format(date); // 'dd' for day, 'MMMM' for full month, 'yy' for year
    };

    const [rowsPerPage, setRowsPerPage] = useState(10);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = journal.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(journal.length / rowsPerPage);
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

    const goto = useNavigate();
    function findPartner(id, type) {
        if (type == 'BILL') {
            const vd = vendor.find(v => v.id == id);
            if (!vd) return ''
            return (
                <>
                    <div className='d-flex start'>
                        <div className="" style={{ height: '50px' }}>
                            <img src={vd ? 'http://localhost:8085/api/images/' + vd.image : ''} alt="" className="h-100" />
                        </div>
                        <div>
                            <p className="f-12 ps-3 text-secondary">
                                Supllier
                            </p>
                            <p className='f-16 ps-3'>{vd.displayName}</p>
                        </div>
                    </div>
                </>
            )
        } else if (type == 'PAYROLL') {
            const emp = employee.find(e => e.id == id);
            // alert(emp.email + '');
            if (!emp) return ''
            return (
                <>
                    <div className='d-flex start'>
                        <div className="" style={{ height: '50px' }}>
                            <img src={emp ? 'http://localhost:8085/api/images/' + emp.image : ''} alt="" className="h-100" />
                        </div>
                        <div>
                            <p className="f-12 ps-3 text-secondary">
                                Employee
                            </p>
                            <p className='f-16 ps-3'>{emp ? emp.firstName + ' ' + emp.lastName : ''}</p>
                        </div>
                    </div>
                </>
            )
        }
        else {
            return ''
        }
    }

    function listTable() {
        return (
            <div className="card border-0">
                <div className="card-body p-0 border">
                    <table className="">
                        <thead valign='middle'>
                            <tr>
                                <Th columnWidth={50}>
                                    <input type="checkbox" name="" className='rounded-0 border pointer px-3' id="" />
                                </Th>
                                <Th columnWidth={50} className='py-3'>No</Th>
                                <Th resizable>Date</Th>
                                <Th resizable>Partner</Th>
                                <Th resizable>Reference</Th>
                                <Th resizable>Journal</Th>
                                <Th resizable>Total</Th>
                                <Th resizable>Status</Th>
                                <Th resizable>Company</Th>



                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentData.map((j, i) =>

                                    <motion.tr
                                        key={j.id}
                                        custom={i}
                                        initial="hidden"
                                        animate="visible"
                                        variants={globleRowVariants}
                                        className={j.journal == 'BILL' ? 'pointer' : 'pointer'} onClick={() => goto(`/journal-detail/${j.id}`)}>
                                        <td>
                                            <input type="checkbox" name="" className='rounded-0 border px-3' id="" />
                                        </td>
                                        <td className='py-3'>{i + 1}</td>

                                        <td>{formatDate(j.date)}</td>
                                        <td>{findPartner(j.partnerId, j.journal)}</td>
                                        <td>{j.reference}</td>
                                        <td>{j.journal}</td>
                                        <td>
                                            {j.journal == 'BILL' || j.journal == 'PAYROLL' ?
                                                <>
                                                    {/* <span className='text-danger'><IoIosArrowRoundDown /></span> */}
                                                    <span className='text-danger'>
                                                        - {formatCurrency.format(j.total)}
                                                    </span>
                                                </>
                                                :
                                                formatCurrency.format(j.total)
                                            }
                                        </td>
                                        <td>{j.status}</td>
                                        <td>Nurak Company's</td>


                                    </motion.tr>
                                )
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }

    return (
        <>

            <div>
                <ActionHeader
                    btnAddName='New Journal'
                    title="Journal Entires"
                    subtitle="View journal entires of all ."
                    searchTerm={searchTerm}
                    onCreate={() => goto('/make-journal')}
                    searchChange={(e) => setSearchTerm(e.target.value)}
                    // onPrint={() => setIsPrint(true)}
                    onExport={() => exportToExcelFiles(journal, 'journal_data')}
                    perPage={perPage()}
                    selectPerPage={selectPerPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                />
                <div className="row">
                    <div className="col-12">
                        {listTable()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Journal
