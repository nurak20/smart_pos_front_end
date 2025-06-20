
import './App.css'
import Menu from './layout/menu/Menu'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from './layout/page/dashboard/Dashboard'
import Desk from './layout/page/desk/Desk'
import Account from './layout/page/accountant/Account'
import Item from './layout/page/inventory/Item'
import InsertItem from './layout/form/inventory/InsertItem'
import ItemDetail from './layout/page/inventory/ItemDestail'
import ViewOrder from './layout/page/report/order/ViewOrder'
import OrderDetail from './layout/page/report/order/OrderDetail'
import Customer from './layout/page/people/customer/Customer'
import CustomerDetail from './layout/page/people/customer/CustomerDetail'
import Employee from './layout/page/people/employee/Employee'
import EmployeeDetail from './layout/page/people/employee/EmployeeDetail'
import CreateEmployee from './layout/form/CreateEmployee'
import CreateCustomer from './layout/form/CreateCustomer'
import Category from './layout/page/inventory/Category'
import Inventory from './layout/page/inventory/Inventory'
import Accountant from './layout/page/accountant/Accountant'
import Report from './layout/page/accountant/Report'
import Setting from './layout/page/setting/Setting'
import User from './layout/page/admin/User'
import Journal from './layout/page/accountant/Journal'
import JournalDetail from './layout/page/accountant/JournalDetail'
import Login from './layout/form/Login'
import Cookies from 'js-cookie'
import { decryptData } from './cryptoJs/Crypto'
import { useContext, useEffect, useState } from 'react'
import PosDark from './layout/page/pos/PosDark'
import PosLight from './layout/page/pos/PosLight'
import Loading from './layout/page/loading/Loading'
import MakeJournal from './layout/form/accounting/MakeJournal'
import MakeChartOfAccount from './layout/form/accounting/MakeChartOfAccount'
import JouranlReport from './layout/page/report/accounting/JouranlReport'
import MakeBill from './layout/form/accounting/MakeBill'
import CustomTable from './layout/page/pos/Custom/CustomTable'
import MobileMenu from './layout/menu/MobileMenu'
import PosMenu from './layout/page/pos/PosMenu'
import OrderTable from './layout/page/pos/OrderTable'
import RExpense from './layout/page/report/accounting/RExpense'
import NetIncomeChart from './layout/page/report/netincome/NetIncomeChart'
import PaymentMethod from './layout/page/report/paymentmethod/PaymentMethod'
import MonthSaleReport from './layout/page/report/monthlysalereport/MonthSale'
import BestSellingMenuItemsChart from './layout/page/report/bestsellingproduct/BestSellingMenuItemsChart'
import { IoChatbubble, IoChatbubbleEllipsesOutline, IoExitOutline, IoSettingsOutline, IoTimerOutline, IoTimeSharp } from 'react-icons/io5'
import { checkingTypeOfUser } from './api/AppConfig'
import { userObject } from './api/AppConfig'
import CategoriesForm from './layout/form/inventory/CategoriesForm'
import { hostName } from './api/host'
import SaleReporting from './layout/page/report/SaleReporting/SaleReporting'
import ExpenseChart from './layout/page/report/accounting/ExpenseChart'
import Revenues from './layout/page/report/revenues/Revenues'
import Expense from './layout/page/report/expense/Expense'
import VendorForm from './layout/form/VendorForm'
import ViewVendor from './layout/page/people/vendor/ViewVendor'
import { RiSettings5Fill, RiVerifiedBadgeFill } from 'react-icons/ri'
import { HiOutlineComputerDesktop } from 'react-icons/hi2'
import OpenSalary from './layout/form/accounting/OpenSalary'
import Company from './layout/page/company/Company'
import BranchForm from './layout/form/BranchForm'
import { findCompanyName } from './api/FindData'
import { getAllBranch } from './api/Branch'
import CompanyDetail from './layout/page/company/companyDetail/CompanyDetail'
import { Avatar, Button, Paper } from '@mui/material'
import VendorDetail from './layout/page/people/vendor/VendorDetail'
import { id, km } from 'date-fns/locale'
import Home from './website/page/home/Home'



import { POSSize, StyleColors, Translate } from './website/extension/Extension'
import POSProductCard from './website/components/pos_card/POSProductCard'
import LanguageSwitcher from './website/languages/LanguageSwitcher'
import { LanguageContext, LanguageProvider } from './website/provider/Provider'


import { WEBRoute } from './website/routes/Routes'
import { FoodBank } from '@mui/icons-material'
import Footer from './website/foother/Foother'
import Navbar from './website/header/Navbar'
import { MainViewConstrainFullHD, MainViewConstrainHD, POSColumn } from './website/extension/ExtensionComponents'
import ProductDetail from './website/page/shop/ProductDetail'
import CategoriesView from './website/page/home/CategoriesView'
import HomePage from './website/page/home/Home'
import MapWithPicker from './website/page/map/MapWithPicker'
import LatLngPicker from './website/page/map/LatLng'
import AppWeb from './AppWeb'
import { AdminRoutes } from './router/Router'
import Pos from './layout/page/pos/Pos'

function AppAdmin() {
    const domainName = hostName();
    const profilePath = `http://${domainName}:8085/api/images/`
    const [userName, setUserName] = useState();
    const [role, setRole] = useState();
    const [profile, setProfile] = useState();
    useEffect(() => {
        try {
            setUserName(userObject().userName ? userObject().userName : 'No User Please login');
            setRole(userObject().role);
            setProfile(userObject().image);
        } catch (e) {

        }
    }, [])
    useEffect(() => {
        applicationViewer();
    }, [userName])
    const mobileMenu = () => {
        return (
            <>
                <div class="offcanvas offcanvas-start w-100" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <Menu />
                    </div>
                </div>
            </>
        )
    }
    const [pageViewer, setPageViewer] = useState();

    const posApplication = () => {
        try {

            const isDarkMode = Cookies.get("mode");
            if (isDarkMode == 1) {
                return (
                    <>
                        <PosDark />
                    </>
                )
            } else {
                return (
                    <>
                        <div className="app">
                            <div className="d-flex">
                                <div className="">
                                    <PosMenu />
                                </div>
                                <div className="content d-block">
                                    <div className="app-page">
                                        <Routes>
                                            <Route path='' element={<Pos />} />
                                            <Route path='/order-history/:id' element={<Pos />} />
                                            <Route path='/order-history' element={<OrderTable />} />
                                            <Route path='*' element={<Pos />} />
                                        </Routes>
                                    </div>




                                </div>
                            </div>

                        </div>


                    </>
                )
            }
        } catch (error) {
            return (
                <>
                    <PosLight />
                </>
            )
        }

    }
    const userLoging = () => {
        return (
            <>
                <Login />
            </>
        )
    }

    function applicationViewer() {
        const userType = checkingTypeOfUser();
        // alert(userType);
        if (userType == 1) setPageViewer(() => administrator());
        if (userType == 2) setPageViewer(() => posApplication());
        if (userType == 3) setPageViewer(() => userLoging());
    }
    const navigate = useNavigate();
    const header = () => {
        return (
            <>
                <div
                    elevation={0}>

                    <div className='d-flex justify-content-between align-items-center w-100 py-2 d-none d-md-none d-lg-flex  px-3 ps-3'>
                        <div className="start">

                            <Button variant='text' className='start gap-2' onClick={() => navigate('/')}>
                                <Avatar alt='image' src='data:image/jpeg;base64,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' />
                                <p style={{ color: StyleColors.appGrayText }}>RS Shopping management system </p>
                            </Button>

                        </div>
                        <div className='end'>
                            <div className='fs-4 d-flex'>
                                <div className='pointer' onClick={() => {
                                    Cookies.set('admin_viewer', 2)
                                    window.location.href = '/';
                                }}>
                                    <HiOutlineComputerDesktop />
                                </div>
                                <div className="position-relative fs-4 mx-3">
                                    <IoChatbubbleEllipsesOutline size={28} />
                                    <span className="position-absolute top-0 start-100 translate-middle f-14 text-danger">
                                        99+
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </div>


                            </div>
                            <LanguageSwitcher />
                            <div className="app-defualt-user d-flex start px-2 py-1 ">
                                <Avatar alt="Remy Sharp" src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg" sx={{ width: 32, height: 32 }} />
                            </div>

                        </div>

                    </div>
                </div>
                <div className='between w-100 py-2 rounded mt-2 bg-white d-md-flex d-lg-none d-sm-flex'>
                    <div className="menu-btn fs-5 pointer w-100 ms-3">
                        <i class="fa-solid fa-bars pointer" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"></i>
                    </div>
                    <button className="btn"
                        onClick={() => {
                            Cookies.set('admin_viewer', 2);
                            location.reload();
                            window.location.href = '/';
                        }}
                    >

                        <i class="fa-solid fa-desktop btn-silver p-3 rounded-circle"></i>
                    </button>

                </div>
            </>
        )
    }
    const administrator = () => {
        return (
            <>
                <div className="app-container fixed w-full h-full flex flex-col">
                    {header()}

                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar - Hidden on smaller screens */}
                        <aside className="w-[300px] bg-gray-50">
                            <Menu />
                        </aside>

                        {/* Main Dashboard Content */}
                        <main className="flex-1 p-2 overflow-y-auto scrollbar-hide overscroll-contain border-0" style={{ scrollbarWidth: "none", }}>
                            <div className='h-full w-100'>
                                <AdminRoutes />
                                {/* {posApplication()} */}
                            </div>
                        </main>
                    </div>
                </div>
            </>
        )
    }





    return (
        <>
            {administrator()}
            {/* {posApplication()} */}

        </>
    )
}


export default AppAdmin
