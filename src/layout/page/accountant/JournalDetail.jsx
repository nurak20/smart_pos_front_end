import { useEffect, useState } from "react";
import { getJournalByID } from "../../../api/JournalE";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { getAllAccount } from "../../../api/Account";
import { Th } from "../../../components/table/DataGrid";
import { getAllBranch } from "../../../api/Branch";
const JournalDetail = () => {


    const { id } = useParams();
    const [branch, setbranch] = useState([]);

    const [account, setAccount] = useState([]);
    const [journalData, setJournalData] = useState({
        "journal": '',
        "branchId": '',
        "partnerId": '',
        "date": '',
        "total": 0,
        "reference": '',
        "status": "Posted"
    });
    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const simpleFormatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "yyyy-mm-dd"); // 'dd' for day, 'MMMM' for full month, 'yy' for year
    };
    const [transactionss, setTransaction] = useState([]);
    useEffect(() => {
        if (id) {
            getJournalByID(id).then((reponse) => {
                setJournalData((prevData) => ({
                    ...prevData,
                    ["journal"]: reponse.data.journalEntries.journal,
                    ["branchId"]: reponse.data.journalEntries.branchId,
                    ["partnerId"]: reponse.data.journalEntries.partnerId,
                    ["date"]: reponse.data.journalEntries.date,
                    ["total"]: reponse.data.journalEntries.total,
                    ["reference"]: reponse.data.journalEntries.reference,
                    ["status"]: reponse.data.journalEntries.status,

                }));
                setTransaction(reponse.data.transactions)
            })
            getAllAccount().then((response) => {
                setAccount(response.data);
            }).catch(e => {
                console.error(e);
            })


        }
        getAllBranch().then((response) => {
            setbranch(response.data);
        })
    }, [])
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en', {
                weekday: 'long',   // Full day of the week (e.g., "Monday")
                day: '2-digit',    // Two-digit day (e.g., "07")
                month: 'numeric',     // Full month name (e.g., "November")
                year: 'numeric'    // Full year (e.g., "2024")
            }).format(date);
        } catch (e) {
            return "Error Date Time Create "
        } // 'dd' for day, 'MMMM' for full month, 'yy' for year
    };

    function getAccountName(id) {
        const findAccount = account.find(f => f.id == id);
        return findAccount.code + '  ' + findAccount.accountName;
    }
    function findBranchName(id) {
        try {
            return branch.find(b => b.id == id).branchName;
        } catch (e) {
            return "No Branch Select"
        }
    }

    return (
        <>

            <div className="container">
                <div className="container-fluid p-0 center">
                    <div className="row w-100">
                        <div className="col-12">

                            <div className="border bg-white w-100 rounded">

                                <div className="d-flex">
                                    <div className='d-block text-start fs-6 bg-white px-4 py-2 w-50'>
                                        <div className='group-input center w-100' style={{ fontSize: 16 }}>
                                            <label htmlFor='references' className='w-25 text-start'>Reference  </label>
                                            <p className="w-75">{journalData.reference}</p>
                                        </div>
                                        <div className='group-input center w-100' style={{ fontSize: 16 }}>
                                            <label htmlFor='references' className='w-25 text-start'>Branch  </label>
                                            <p className="w-75">{findBranchName(journalData.branchId)}</p>
                                        </div>
                                        <div className='group-input center w-100' style={{ fontSize: 16 }}>
                                            <label htmlFor='references' className='w-25 text-start'>Total  </label>
                                            <p className="w-75">{formatCurrency.format(journalData.total)}</p>
                                        </div>

                                    </div>
                                    <div className='d-block text-start bg-white px-4 py-2 w-50 mt-1'>
                                        <div className='group-input center w-100 py-1' style={{ fontSize: 16 }}>
                                            <label htmlFor='references' className='w-25 text-start'>Date  </label>
                                            <p className="w-75">{formatDate(journalData.date)}</p>
                                        </div>
                                        <div className='group-input center w-100 py-1' style={{ fontSize: 16 }}>
                                            <label htmlFor='references' className='w-25 text-start'>Journal   </label>
                                            <p className="w-75">{journalData.journal}</p>
                                        </div>
                                    </div>
                                </div>


                                <div className='bg-white py-3'>
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="text-dark nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Journal Item</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button class="text-dark nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Note</button>
                                        </li>

                                    </ul>
                                    <div class="tab-content border-0" id="myTabContent">
                                        <div class="border-0 tab-pane show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                                            <div className="p-0">
                                                <table className="table-hover w-100 p-0">
                                                    <thead>
                                                        <tr>
                                                            <Th resizable className="py-3">Account</Th>
                                                            <Th resizable className="py-3">Label</Th>
                                                            <Th resizable className="py-3">Debit</Th>
                                                            <Th resizable className="py-3">Credit</Th>
                                                            <Th columnWidth={50} className="py-3">Action</Th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            transactionss.map(t =>
                                                                <tr className="pointer">
                                                                    <td className="py-3">{getAccountName(t.accountId)}</td>
                                                                    <td>{t.label}</td>
                                                                    <td>{formatCurrency.format(t.debit)}</td>
                                                                    <td>{formatCurrency.format(t.credit)}</td>
                                                                    <td><i class="fa-solid fa-trash-can remove"></i></td>
                                                                </tr>
                                                            )
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="border-0 tab-pane p-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">

                                            {/* <p className='w-100'>{productData.description}</p> */}

                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div >

        </>
    )
}





export default JournalDetail
