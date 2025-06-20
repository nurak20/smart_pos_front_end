import { useEffect, useState } from "react"
import { getAllAccount } from "../../../api/Account";
import { getAllAccountType } from "../../../api/AccountType";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { Th } from "../../../components/table/DataGrid";
import { FaFileExcel, FaFilter, FaPlus, FaPrint, FaSearch } from "react-icons/fa";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { exportToExcelFiles, globleRowVariants, perPage, searchData } from "../../../api/AppConfig";
import ActionHeader from "../../../components/listheader/ActionHeader";
import { motion } from "framer-motion";
const Account = () => {
    const [account, setAccount] = useState([]);
    const [accountType, setAccountType] = useState([]);
    useEffect(() => {
        getData();
    }, [])
    function getData() {
        getAllAccount().then((response) => {
            setAccount(response.data);
        })
        getAllAccountType().then((response) => {
            setAccountType(response.data);
        })
    }
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!searchTerm) {
            getData();
            return
        }
        setAccount(searchData(account, searchTerm, ["accountName", "id"]));

    }, [searchTerm]);
    function getAccountTypeName(id) {
        try {
            const objAccountType = accountType.find(a => a.id == id);
            return objAccountType.accountType;
        } catch (e) {
            return "No Accountype Selected"
        }
    }
    const goto = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    function selectPerPage(selected) {
        setRowsPerPage(selected.value);
    }
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the categories array to display only the current page's rows
    const currentData = account.slice(startIndex, endIndex);

    // Total number of pages
    const totalPages = Math.ceil(account.length / rowsPerPage);
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
    return (
        <>

            <div>
                <ActionHeader
                    btnAddName='New Account'
                    title="Chart Of Account"
                    subtitle="View account of all ."
                    searchTerm={searchTerm}
                    onCreate={() => goto('/make-account')}
                    searchChange={(e) => setSearchTerm(e.target.value)}
                    // onPrint={() => setIsPrint(true)}
                    onExport={() => exportToExcelFiles(account, 'journal_data')}
                    perPage={perPage()}
                    selectPerPage={selectPerPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                />
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0">

                            <div className="card-body p-0">
                                <table className="">
                                    <thead>
                                        <tr >
                                            <Th resizable className="py-3">No</Th>
                                            <Th resizable>Code</Th>
                                            <Th resizable>AccountName</Th>
                                            <Th resizable>Account Type</Th>
                                            <Th resizable>Currency</Th>
                                            <Th resizable>Branch</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentData.map((a, i) =>
                                                <motion.tr
                                                    key={a.id}
                                                    custom={i}
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={globleRowVariants}
                                                    className="py-3 pointer">
                                                    <td className="py-3">{i + 1}</td>
                                                    <td>{a.code}</td>
                                                    <td>{a.accountName}</td>
                                                    <td>{getAccountTypeName(a.accountTypeId)}</td>
                                                    <td>USD</td>
                                                    <td>Nurak Company's</td>
                                                </motion.tr>
                                            )
                                        }
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Account
