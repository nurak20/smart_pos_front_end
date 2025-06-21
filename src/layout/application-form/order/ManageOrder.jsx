import React from 'react'
import OrderTable from './OrderTable'
import { ShimmerTable } from '../../../website/components/animation/Shimmer'
import { Button } from '@mui/material'
import { StyleColors, Translate } from '../../../website/extension/Extension'
import { Style } from '@mui/icons-material'
import { IoAdd, IoFilter } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const ManageOrder = () => {

    const navigate = useNavigate();


    return (
        <div className='p-4'>
            <div>
                <div className='flex justify-between items-center py-3 pt-0'>
                    <Button onClick={() => navigate(`/manage/product`)} startIcon={<IoAdd />} variant='contained' className='px-4' color={StyleColors.componentsColor} sx={{ textTransform: "capitalize", backgroundColor: StyleColors.componentsColor, color: "white" }}>
                        {Translate({ km: "គ្រប់គ្រងអីវ៉ាន់", en: "Manage Products" })}
                    </Button>
                    <Button startIcon={<IoFilter />} variant='text' className='px-4' color={StyleColors.componentsColor} sx={{ textTransform: "capitalize", color: StyleColors.componentsColor }}>
                        {Translate({ km: "ស្វែងរក", en: "Filter" })}
                    </Button>

                </div>
            </div>
            <div className='bg-white rounded-md p-4'>
                <OrderTable />
            </div>
        </div>
    )
}

export default ManageOrder
