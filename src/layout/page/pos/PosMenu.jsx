import './postest.css'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { SlGrid } from 'react-icons/sl';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { CiShoppingCart } from 'react-icons/ci';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { userObject } from '../../../api/AppConfig';
const PosMenu = () => {
    const [checkUser, setCheckUser] = useState();
    function findTotalOrder() {
        try {
            const orderTables = JSON.parse(Cookies.get("table-order") || '[]'); // Default to empty array
            console.log(orderTables);

            if (Array.isArray(orderTables)) {
                return orderTables.length;
            } else {
                return 0; // If `orderTables` is not an array
            }
        } catch (error) {
            console.error("Error finding total order:", error);
            return 0;
        }
    }

    useEffect(() => {

    }, [])
    const goto = useNavigate();
    return (
        <>
            <div className='pos-menu' style={{ overflow: 'visible' }}>

                <nav className='pos-nav py-2 box-shadow'>
                    <div className='navbar-item'>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "button-pos-menu active-button " : "button-pos-menu menu-button"
                            }
                        >
                            <SlGrid />
                            {/* <i class="fa-solid fa-tablet-screen-button w-100"></i> */}

                        </NavLink>
                    </div>

                    <div className='navbar-item'>
                        <NavLink
                            to="/order-history"
                            className={({ isActive }) =>
                                isActive ? "button-pos-menu active-button " : "button-pos-menu menu-button"
                            }
                        >
                            <div class="position-relative w-100">
                                <CiShoppingCart />
                                {/* <i class="fa-solid fa-cart-shopping w-100"></i> */}
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger f-14" style={{ zIndex: '10' }}>
                                    {findTotalOrder()}
                                </span>
                            </div>


                        </NavLink>
                    </div>
                    <div className='navbar-item'>

                        {checkUser ? (
                            <NavLink
                                to='/list-product'
                                className={({ isActive }) =>
                                    isActive ? "button-pos-menu active-button" : "button-pos-menu menu-button"
                                }
                                onClick={() => {
                                    Cookies.remove('user-data');
                                    window.location.href = '/'
                                }}
                            >

                                <i class="fa-solid fa-arrow-right-from-bracket w-100 text-danger"></i>
                            </NavLink>
                        ) : (
                            <NavLink
                                to='/list-product'
                                className={({ isActive }) =>
                                    isActive ? "button-pos-menu active-button" : "button-pos-menu menu-button "
                                }
                                onClick={() => {
                                    Cookies.set("admin_viewer", 1);
                                    window.location.href = '/'
                                    location.reload();
                                }}
                            >

                                <i class="fa-solid fa-arrow-right-from-bracket w-100"></i>
                            </NavLink>

                        )}
                    </div>



                </nav>






            </div>

        </>

    )
}

export default PosMenu
