import { Link } from 'react-router-dom'
import './item.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const Inventory = () => {

    const goto = useNavigate();

    function listCard() {
        return (
            <>
                <div className="w-100 row">
                    <div className="col-xl-3 col-sm-12">
                        <div className="card btn-silver bg-white p-0 pointer mb-2 inv-card"
                            onClick={() => goto(`/list-item`)}
                            style={{ height: '160px' }}
                        >
                            <div className="card-body p-0">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '160px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-mug-hot fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-5'>Manage Item</div>
                                        <div className='fs-6'>Last Insert Item 2024-10-10</div>
                                        <div className='font-12 text-start text-secondary'>
                                            Manage All Item Create ,Update , Remove
                                        </div>
                                        <div className='text-start fw-bold'>16</div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-12">
                        <div className="card bg-white p-0 pointer mb-2 inv-card"
                            onClick={() => goto(`/list-category`)}
                            style={{ height: '160px' }}
                        >
                            <div className="card-body p-0 rounded">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '160px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-box-tissue fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-5'>Manage Cateogry</div>
                                        <div className='fs-6'>Last Insert Category 2024-10-10</div>
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
                        <div className="card bg-white p-0 pointer mb-2 inv-card"
                            onClick={() => goto(`/list-purchase`)}
                            style={{ height: '160px' }}
                        >
                            <div className="card-body p-0 rounded">
                                <div className="d-flex">
                                    <div className="w-25 center ">
                                        <div className="center rounded " style={{ height: '160px', overflow: 'hidden' }}>
                                            <i class="fa-solid fa-hand-holding-dollar fs-1"></i>
                                        </div>
                                    </div>
                                    <div className='font-12 w-75 py-3'>
                                        <div className='fs-5'>Purchase Item</div>
                                        <div className='fs-6'>Last Insert Item 2024-12-10</div>
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

export default Inventory
