import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
const Report = () => {
    const goto = useNavigate();
    return (
        <>
            <div className='container-fluid px-1'>
                <div className="row w-100">
                    <div className="col-12">
                        <Outlet />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Report
