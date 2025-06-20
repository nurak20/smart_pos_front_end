import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchJournal } from '../../../../api/JournalE';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
const JouranlReport = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const [day, month, year] = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date).split('/');
        return `${day}-${month}-${year}`; // returns 'dd-mm-yyyy'
    };

    const [journal, setJounal] = useState([]);
    const [objDate, setObjDate] = useState(
        {
            "startDate": '',
            "endDate": ''
        }
    )
    useEffect(() => {
        console.log(objDate);
        fetchJournal(objDate).then((response) => {
            setJounal(response.data);
            console.log(response.data);
        }).catch(e => {
            console.error(e);
        })
    }, [objDate])
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const goto = useNavigate();

    function listTable() {
        return (
            <div className="card border-0">
                <div className="card-body p-0 border">
                    <table className="table table-striped table-hover">
                        <thead valign='middle f-14'>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" className='rounded-0 border pointer px-3' id="" />
                                </td>
                                <td className='py-3'>No</td>
                                <td>Date</td>
                                <td>Account Name</td>
                                <td>Debit</td>
                                <td>Credit</td>



                            </tr>
                        </thead>
                        <tbody>
                            {
                                journal.map((j, i) =>
                                    <tr className="pointer " onClick={() => goto(`/journal-detail/${j.id}`)}>
                                        <td>

                                        </td>
                                        <td className='py-3'>{i + 1}</td>
                                        <td>{j.accountingDate}</td>
                                        <td>{j.accountName}</td>
                                        <td>{formatCurrency.format(j.totalDebit)}</td>
                                        <td>{formatCurrency.format(j.totalCredit)}</td>



                                    </tr>
                                )

                            }
                            <tr className="pointer ">
                                <td>

                                </td>
                                <td className='py-5'></td>
                                <td></td>
                                <td></td>
                                <td className='f-20'>$7000.00</td>
                                <td className='f-20'>$7000.00</td>


                            </tr>

                        </tbody>

                    </table>
                </div>
            </div>
        )
    }
    function handleDate(e) {
        const { name, value } = e.target;
        setObjDate((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const ExportExcel = (data, fileName) => {
        // 1. Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 2. Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // 3. Write the workbook to an Excel file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    function menu() {
        return (
            <>
                <div className="w-100 ">
                    <div className="d-flex px-2 py-3 rounded">
                        <div className='d-flex start w-50'>
                            <Link className="btn btn-success box-shadow px-3" to='/make-journal'>
                                <span className='pe-2'><i class="fa-solid fa-circle-plus"></i></span>
                                <span className=''>New</span>
                            </Link>
                            <div class="btn-group ms-3" role="group" aria-label="Basic mixed styles example">
                                <button type="button" class="btn btn-outline-secondary"><span className='pe-2'><i class="fa-solid fa-print"></i></span>Print</button>
                                <button type="button" class="btn btn-outline-secondary" onClick={() => ExportExcel(journal, "journal_data")}><span className='pe-2'><i class="fa-solid fa-file-export"></i></span>Export</button>
                            </div>

                        </div>
                        <div className='d-flex end w-50'>
                            <div class="btn-group w-100" role="group" aria-label="Basic mixed styles example">
                                <div className='w-100 px-2'>
                                    <label htmlFor="startDate" className='w-25'>Start Date</label>
                                    <input type="date" className='p-2 w-75 text-center border' id='startDate' onChange={handleDate} value={objDate.startDate} name='startDate' />
                                </div>
                                <div className='w-100 px-2'>
                                    <label htmlFor="endDate" className='w-25'>End Date</label>
                                    <input type="date" className='p-2 w-75 text-center border' id='endDate' onChange={handleDate} value={objDate.endDate} name='endDate' />
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
            </>
        )
    }

    return (
        <>

            <div>
                {menu()}
                <div className="row">
                    <div className="col-12">
                        {listTable()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default JouranlReport

