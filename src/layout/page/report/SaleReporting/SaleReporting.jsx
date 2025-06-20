import React from 'react'
import MonthSale from '../monthlysalereport/MonthSale'
import DailySale from '../dailysalereport/DailySale'

const SaleReporting = () => {
    return (
        <div className='container-fluid p-0'>
            <div className='p-3'>
                <p className="ps-4 border-start mt-2">Monthly sale report</p>
                <MonthSale />
                <p className="ps-4 border-start mt-5">Daily sale report</p>
                <DailySale />
            </div>

        </div>
    )
}

export default SaleReporting
