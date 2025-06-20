import React from 'react'
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { userObject } from '../../api/AppConfig';

const ED = ({ deleteClick, updateClick }) => {
    return (
        <div>

            <div className="d-flex">
                {
                    userObject().role == 'ADMIN' ? <button className='btn btn-outline-danger pointer' onClick={deleteClick}>
                        < RiDeleteBin6Line className='' />
                    </button> :
                        <button className='btn btn-outline-danger pointer' disabled>
                            < RiDeleteBin6Line className='' />
                        </button>
                }
                <div className='px-2'>
                    <button className='btn btn-outline-success pointer' onClick={updateClick}>
                        <CiEdit className='' />
                    </button>
                </div>

            </div>

        </div>
    )
}

export default ED
