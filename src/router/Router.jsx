import { Route, Routes } from "react-router-dom";
import { POSRoute } from "../website/routes/Routes";
import ManageProuct from "../layout/application-form/product/ManageProuct";
import Dashboard from "../layout/page/dashboard/Dashboard";
import ManageOrder from "../layout/application-form/order/ManageOrder";
import CategorySection from "../layout/application-form/category/CategorySection";

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path={POSRoute.home} element={<><Dashboard UserName={'Nurak Oeurn '} /></>} />
            <Route path={POSRoute.manageProduct} element={<><ManageProuct /></>} />
            <Route path={POSRoute.manageOrder} element={<><ManageOrder /></>} />
            <Route path={POSRoute.manageCategory} element={<><CategorySection /></>} />
        </Routes>
    );
};
