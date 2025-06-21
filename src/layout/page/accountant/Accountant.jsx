import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const Accountant = () => {

    const goto = useNavigate();

    function listCard() {
        return (
            <>
                <div className="w-100 row">
                    <div className="col-xl-4 col-sm-12">
                        <div className="card bg-white p-0 pointer mb-2 box-shadow inv-card"
                            onClick={() => goto(`/chart-of-account`)}
                            style={{ height: '200px' }}
                        >
                            <div className="card-body p-0 rounded">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '200px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-circle-exclamation fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-3'>Chart Of Account</div>
                                        <div className='fs-6'>Last Insert 2024-10-10</div>
                                        <div className='font-12 text-start text-secondary'>
                                            Manage All Category Create ,Update , Remove
                                        </div>
                                        <div className='text-start fw-bold'>3</div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-12">
                        <div className="card  bg-white p-0  pointer mb-2 box-shadow inv-card"
                            onClick={() => goto(`/journal`)}
                            style={{ height: '200px' }}
                        >
                            <div className="card-body p-0 rounded">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '200px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-book-journal-whills fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-3'>Journal Entries</div>
                                        <div className='fs-6'>Last Insert 2024-12-10</div>
                                        <div className='font-12 text-start text-secondary'>
                                            Manage All Item View,Create ,Update , Remove
                                        </div>
                                        <div className='text-start fw-bold'>1200</div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-12">
                        <div className="card  bg-white p-0  pointer mb-2 box-shadow inv-card"
                            onClick={() => goto(`/make-bill`)}
                            style={{ height: '200px' }}
                        >
                            <div className="card-body p-0 rounded">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '200px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-book-journal-whills fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-3'>BILL</div>
                                        <div className='fs-6'>Last Insert 2024-12-10</div>
                                        <div className='font-12 text-start text-secondary'>
                                            Manage All Item View,Create ,Update , Remove
                                        </div>
                                        <div className='text-start fw-bold'>1200</div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-12">
                        <div className="card bg-white p-0 pointer mb-2 box-shadow inv-card"
                            onClick={() => goto(`/reporting`)}
                            style={{ height: '200px' }}
                        >
                            <div className="card-body p-0 rounded">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '200px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-book fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-3'>Report</div>
                                        <div className='fs-6'>Last Insert 2024-12-10</div>
                                        <div className='font-12 text-start text-secondary'>
                                            Manage All Item View,Create ,Update , Remove
                                        </div>
                                        <div className='text-start fw-bold'>1200</div>
                                    </div>


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
                <div className="row">
                    <div className="col-12">
                        {listCard()}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Accountant
