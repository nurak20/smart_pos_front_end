import { Button, Paper } from '@mui/material'
import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { userObject } from '../../api/AppConfig'

const DetailED = ({ deleteClick, updateClick }) => {
    return (
        <div>

            <div>

                <div className="between">
                    {userObject().role == 'ADMIN' ? <Button variant='outlined' color='error' onClick={deleteClick}>< RiDeleteBin6Line className='fs-5 ' /></Button>
                        : <Button variant='outlined' color='error' disabled>< RiDeleteBin6Line className='fs-5 ' /></Button>}
                    <Button variant='outlined' color='success' onClick={updateClick}><CiEdit className='fs-5 ' /></Button>

                </div>

            </div>

        </div>
    )
}

export default DetailED
