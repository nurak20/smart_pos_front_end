import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaEnvelope, FaSearch, FaShoppingCart, FaUser, FaUserCircle } from "react-icons/fa";
import { HiLanguage } from "react-icons/hi2";
import { CiSearch, CiUser, CiShoppingCart } from "react-icons/ci";
import LanguageSwitcher from "../languages/LanguageSwitcher";
import './header.css';
import { CiShoppingBasket } from "react-icons/ci";
import { StyleColors, Translate } from "../extension/Extension";
import website from '../json/website.json';
import { km } from "date-fns/locale";
import { POSRoute } from "../routes/Routes";
import { IoPauseCircleOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { useAppUserVerify, useCartCount } from "../provider/Provider";
import logo from '../../assets/image/rs_logo.jpg'
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const navigate = useNavigate();
    const { isLogin } = useAppUserVerify();
    const navItems = [
        { id: 1, name: website.Label.Home, path: "/", icon: null },
        { id: 2, name: website.Label.Product, path: "/products", icon: null },
        { id: 3, name: website.Label.NewArrivals, path: "/new", icon: null },

    ];
    const { countCart } = useCartCount();

    return (
        <>
            <div className="pos-navbar-container fixed-top top-0">
                <nav className="pos-navbar">

                    <div className="pos-navbar-content">
                        {/* Brand Logo Section */}
                        <div className="pos-navbar-brand">
                            <div className="pos-navbar-logo">
                                <img
                                    src={logo}
                                    alt="Nurak Smart POS"
                                />
                            </div>
                            <div className="pos-navbar-brand-name">
                                <span>RS Shoping</span>
                            </div>
                        </div>

                        {/* Menu Section - Desktop */}
                        <div className="pos-navbar-menu">
                            <ul className="pos-navbar-nav">
                                {navItems.map((item) => (
                                    <li key={item.id} className="pos-navbar-item">
                                        <Link to={item.path} className="pos-navbar-link">
                                            {item.icon && <span className="pos-navbar-icon">{item.icon}</span>}
                                            <span>{Translate(item.name)}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions Section */}
                        <div className="pos-navbar-actions gap-2">
                            <div className="pos-navbar-action-item">
                                <CiSearch size={22} />
                            </div>
                            <div>


                                <Link to={POSRoute.location} className="" color={StyleColors.appGrayText} style={{ fontWeight: '400' }}>
                                    <span>{Translate({
                                        km: 'ទីតាំងរបស់អ្នក',
                                        en: 'Your Location'
                                    })}</span>
                                </Link>
                                <CiLocationOn size={22} />
                            </div>

                            <div className="pos-navbar-action-item" >
                                <button type="button" color="white" style={{ height: '30px', width: '30px', background: StyleColors.componentsColor, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}
                                    onClick={() => navigate(POSRoute.cart)} >
                                    <CiShoppingBasket size={22} />
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {countCart}
                                    </span>
                                </button>

                            </div>
                            <div className="pos-navbar-action-item" >
                                <LanguageSwitcher />
                            </div>
                            {isLogin() && <div className="">
                                <div style={{ height: '30px', width: '30px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: StyleColors.componentsColor, overflow: 'hidden' }}>
                                    <Link to={POSRoute.profile} className="h-100 w-100" color='white' style={{ fontWeight: '400' }}>
                                        <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" className="h-100 w-auto" />
                                    </Link>
                                </div>

                            </div>}
                            {!isLogin() && <div className="">
                                <div style={{ height: '30px', width: '30px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: StyleColors.componentsColor, overflow: 'hidden' }}>
                                    <Link to={POSRoute.profile} className="h-100 w-100" color='white' style={{ fontWeight: '400' }}>
                                        <img src="https://images.macrumors.com/t/n4CqVR2eujJL-GkUPhv1oao_PmI=/1600x/article-new/2019/04/guest-user-250x250.jpg" alt="" className="h-100 w-auto" />
                                    </Link>
                                </div>

                            </div>}

                        </div>

                        {/* Mobile Menu Button */}
                        <div className="pos-navbar-mobile-toggle" onClick={toggleMenu}>
                            <div className={`pos-navbar-hamburger ${isMenuOpen ? 'active' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}

                    <div className={`pos-navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="pos-navbar-mobile-nav">
                            {navItems.map((item) => (
                                <li key={item.id} className="pos-navbar-mobile-item">
                                    <Link to={item.path} className="pos-navbar-mobile-link" onClick={toggleMenu}>
                                        {item.icon && <span className="pos-navbar-mobile-icon">{item.icon}</span>}
                                        <span>{Translate(item.name)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;