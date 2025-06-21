import './menu.css'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
const MobileMenu = () => {
    const goto = useNavigate();
    return (
        <>
            <div className=' rounded h-100 box-shadow menu' style={{
                overflow: 'scroll', scrollbarWidth: 'none', // For Firefox
                msOverflowStyle: 'none',
            }}>
                <div className="app-logo p-2" onClick={() => goto('/')}>
                    <img src="src/assets/image/logo.png" alt="" className='h-100' /> <br />
                    <div className='px-4 fw-bold fs-6'>FAST FOOD KH.</div>
                </div>
                <hr />
                <nav>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className="w-25">
                            <i className="fa-solid fa-globe"></i>
                        </span>
                        <span className="w-75 text-start">Dashboard</span>
                    </NavLink>
                    <div className="menu-title">
                        Inventory
                    </div>

                    <NavLink className={({ isActive }) =>
                        isActive ? "  active-link" : "menu-item"
                    } to='/list-item'>
                        <span className='w-25'><i class="fa-solid fa-bowl-food"></i></span>
                        <span className='w-75 text-start'>Product</span>
                    </NavLink>
                    <NavLink className={({ isActive }) =>
                        isActive ? "  active-link" : "menu-item"
                    } to='/list-category'>
                        <span className='w-25'><i class="fa-solid fa-bolt"></i></span>
                        <span className='w-75 text-start'>Category</span>
                    </NavLink>
                    <NavLink
                        to='/purchase'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-layer-group"></i></span>
                        <span className='w-75 text-start'>Purchase</span>
                    </NavLink>

                    <div className="menu-title ">
                        Order reporting
                    </div>
                    <NavLink
                        to='/pos-order'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-file-lines"></i></span>
                        <span className='w-75 text-start'>Pos order</span>
                    </NavLink>

                    <NavLink
                        to='/web-order'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-brands fa-wikipedia-w"></i></span>
                        <span className='w-75 text-start'>Website order</span>
                    </NavLink>
                    <NavLink
                        to='/order-detail'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-circle-info"></i></span>
                        <span className='w-75 text-start'>Order details</span>
                    </NavLink>
                    <div className="menu-title">
                        User Management
                    </div>
                    <NavLink
                        to='/employees'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-users"></i></span>
                        <span className='w-75 text-start'>Employees</span>
                    </NavLink>

                    <NavLink
                        to='/list-customer'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-circle-user"></i></span>
                        <span className='w-75 text-start'>Customer</span>
                    </NavLink>
                    <NavLink
                        to='/list-vendor'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-user-tie"></i></span>
                        <span className='w-75 text-start'>Vendor</span>
                    </NavLink>
                    <div className="menu-title">
                        Accounting
                    </div>
                    <NavLink
                        to='/journal'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-book"></i></span>
                        <span className='w-75 text-start'>Journal entries</span>
                    </NavLink>
                    <NavLink
                        to='/chart-of-account'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-asterisk"></i></span>
                        <span className='w-75 text-start'>Chart of accounts</span>
                    </NavLink>
                    {/* <div className="menu-title fs-6">
                    ATTRIBUTE
                </div> */}
                    <NavLink
                        to='/setting'
                        className={({ isActive }) =>
                            isActive ? "  active-link" : "menu-item"
                        }
                    >
                        <span className='w-25'><i class="fa-solid fa-gear"></i></span>
                        <span className='w-75 text-start'>Setting</span>
                    </NavLink>

                </nav>






            </div>

        </>

    )
}

export default MobileMenu
