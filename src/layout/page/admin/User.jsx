import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';

const User = () => {
    const users = [
        {
            id: 1,
            userName: "user1",
            password: "password1",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 2,
            userName: "user2",
            password: "password2",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 3,
            userName: "user3",
            password: "password3",
            role: "staff",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        },
        {
            id: 4,
            userName: "user4",
            password: "password4",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        },
        {
            id: 5,
            userName: "user5",
            password: "password5",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin3",
            updateBy: "admin3",
        },
        {
            id: 6,
            userName: "user6",
            password: "password6",
            role: "staff",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 7,
            userName: "user7",
            password: "password7",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 8,
            userName: "user8",
            password: "password8",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        },
        {
            id: 9,
            userName: "user9",
            password: "password9",
            role: "staff",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin3",
            updateBy: "admin3",
        },
        {
            id: 10,
            userName: "user10",
            password: "password10",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 11,
            userName: "user11",
            password: "password11",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        },
        {
            id: 12,
            userName: "user12",
            password: "password12",
            role: "staff",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin3",
            updateBy: "admin3",
        },
        {
            id: 13,
            userName: "user13",
            password: "password13",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 14,
            userName: "user14",
            password: "password14",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        },
        {
            id: 15,
            userName: "user15",
            password: "password15",
            role: "staff",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin3",
            updateBy: "admin3",
        },
        {
            id: 16,
            userName: "user16",
            password: "password16",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 17,
            userName: "user17",
            password: "password17",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        },
        {
            id: 18,
            userName: "user18",
            password: "password18",
            role: "staff",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin3",
            updateBy: "admin3",
        },
        {
            id: 19,
            userName: "user19",
            password: "password19",
            role: "admin",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin1",
            updateBy: "admin1",
        },
        {
            id: 20,
            userName: "user20",
            password: "password20",
            role: "manager",
            createdDate: "2024-10-25T10:00:00Z",
            updatedDate: "2024-10-25T10:00:00Z",
            createBy: "admin2",
            updateBy: "admin2",
        }
    ];

    const goto = useNavigate();
    function listTable() {
        return (
            <div className="card border-0">
                <div className="card-body p-0 border">
                    <table className="table table-striped table-hover">
                        <thead valign='middle'>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" className='rounded-0 border pointer px-3' id="" />
                                </td>
                                <td className='py-3'>No</td>
                                <td>Username</td>
                                <td>Password</td>
                                <td>Role</td>
                                <td>CreatedDate</td>
                                <td>UpdatedDate</td>
                                <td>CreatedBy</td>
                                <td>UpdatedBy</td>
                                <td>Branch</td>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                users.map((u, i) =>
                                    <tr className="pointer" onClick={() => goto(`/item-detail`)}>
                                        <td>
                                            <input type="checkbox" name="" className='rounded-0 border px-3' id="" />
                                        </td>
                                        <td className='py-3'>{i + 1}</td>
                                        <td>{u.userName}</td>
                                        <td>{u.password}</td>
                                        <td>{u.role}</td>
                                        <td>{u.createdDate}</td>
                                        <td>{u.updatedDate}</td>
                                        <td>{u.createBy}</td>
                                        <td>{u.updateBy}</td>
                                        <td>Phnom Penh</td>



                                    </tr>
                                )
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='animation'>
                <div className="row">
                    <div className="col-xl-10 col-md-9 col-12">
                        {listTable()}
                    </div>
                    <div className="col-xl-2 col-md-3 col-12">
                        <div className="d-block px-2 py-3 bg-white sticky rounded">
                            <Link className="menu-item border-bottom nav-link" to='/create-employee'>
                                <span className='menu-icon'><i class="fa-solid fa-circle-plus"></i></span>
                                <span className='btn-menu-link'>New</span>
                            </Link>

                            <div className="menu-item border-bottom">
                                <span className='menu-icon'><i class="fa-solid fa-print"></i></span>
                                <span className='btn-menu-link'>Print</span>
                            </div>

                            <div className="menu-item border-bottom">
                                <span className='menu-icon'><i class="fa-solid fa-file-export"></i></span>
                                <span className='btn-menu-link'>Export</span>
                            </div>
                            <div className="menu-item border-bottom" >
                                <span className='menu-icon'><i class="fa-solid fa-list"></i></span>
                                <span className='btn-menu-link'>List</span>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default User
