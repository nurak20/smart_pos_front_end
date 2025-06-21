import { Route, Routes } from "react-router-dom";
import { POSRoute } from "../website/routes/Routes";
import ManageProduct from "../layout/application-form/product/ManageProuct";
import Dashboard from "../layout/page/dashboard/Dashboard";
import ManageOrder from "../layout/application-form/order/ManageOrder";
import CategorySection from "../layout/application-form/category/CategorySection";
import Login from "../layout/auth/Login";
import ProtectedRoute from "../layout/auth/ProtectRoute";
import AppAdmin from "../AppAdmin";

export const AdminRoutes = () => {
    console.log("AdminRoutes");
    return (
        <Routes>
            <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path={POSRoute.home} element={<Dashboard UserName={'Nurak Oeurn'} />} />
                <Route path={POSRoute.manageProduct} element={<ManageProduct />} />
                <Route path={POSRoute.manageOrder} element={<ManageOrder />} />
                <Route path={POSRoute.manageCategory} element={<CategorySection />} />
            </Route>
        </Routes>
    );
};