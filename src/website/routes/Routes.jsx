
import { Routes, Route } from "react-router-dom"
import Home from "../page/home/Home"

import ProductDetail from "../page/shop/ProductDetail"
import LoginAccount from "../page/setting/LoginAccount"
import ShoppingCartPage from "../page/shop/ShopingCard"
import UserAddress from "../page/map/UserAddress"
import GoogleMapsGeocoder from "../page/map/GoogleMapsGeocoder"
import LeafletMap from "../page/map/PosMap"
import RegisterForm from "../page/form/POSRegister"
import BarcodeGenerator from "../components/barcode/Barcode"
import EditProfileForm from "../page/form/POSEditProfile"
import GuestOrderForm from "../page/form/GuestOrderForm"
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'
import Products from "../page/shop/Products"

export const WEBRoute = () => {
    return <>
        <Routes>
            <Route element={<LoginMiddleWare />}>
                <Route path={'/login'} element={<><LoginAccount /></>} />
            </Route>


            <Route element={<MiddleWare />}>
                <Route path={POSRoute.home} element={<Home />} />

                <Route path={'/product-details'} element={<ProductDetail />} />
                <Route path={POSRoute.allProducts} element={<Products />} />


                <Route path={POSRoute.cart} element={<><ShoppingCartPage /></>} />
                <Route path={'/create-address'} element={<><UserAddress /></>} />
                <Route path={'/register'} element={<RegisterForm />} />
                <Route path={'/barcode'} element={<BarcodeGenerator />} />
                <Route element={<ProfileMiddleWare />}>
                    <Route path={POSRoute.profile} element={<EditProfileForm />} />
                </Route>

                <Route path={POSRoute.guestOrder} element={<GuestOrderForm />} />
            </Route>

            <Route path="*" element={<h1>404 NOT FOUND</h1>} />

        </Routes>

    </>
}

const MiddleWare = () => {

    // otherwise render the child routes
    return <Outlet />;
};

const LoginMiddleWare = () => {
    const token = Cookies.get('access_token');
    // if no token, redirect to login
    if (token) {
        return <Navigate to={POSRoute.profile} replace />;
    }
    // otherwise render the child routes
    return <Outlet />;
};
const ProfileMiddleWare = () => {
    const token = Cookies.get('access_token');
    // if no token, redirect to login
    if (!token) {
        return <Navigate to={POSRoute.login} replace />;
    }
    // otherwise render the child routes
    return <Outlet />;
};


export const POSRoute = {
    home: '/',
    allProducts: '/products',
    productDetail: '/product/:id',  // Keep this one as the dynamic route
    productDetailStatic: '/product-details',  // Rename the static route
    bestSellers: '/best-sellers',
    newArrivals: '/new-arrivals',
    sale: '/sale',
    men: '/men',
    women: '/women',
    kids: '/kids',
    accessories: '/accessories',
    aboutUs: '/about-us',
    contactUs: '/contact-us',
    guestOrder: "/guest-order",
    faq: '/faq',
    privacyPolicy: '/privacy-policy',
    termsAndConditions: '/terms-and-conditions',
    login: '/login',
    register: '/register',
    profile: '/profile',
    cart: '/shoping-cart',
    checkout: '/checkout',
    orderHistory: '/order-history',
    wishlist: '/wishlist',
    search: '/search',
    location: '/location',
    notFound: '*',
    manageProduct: "product",
    manageOrder: "manage-order",
    manageCategory: "category",
    manageWarehouse: "warehouse",
};
