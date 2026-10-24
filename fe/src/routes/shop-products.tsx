import { createRoute } from "@tanstack/react-router";
import ShopProductsPage from "../pages/shopProducts";
import { rootRoute } from "./__root";
import AdminRouteGuard from "../component/adminGuard";

const shopProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/products",
  component: () => (
    <AdminRouteGuard>
      <ShopProductsPage />
    </AdminRouteGuard>
  ),
});

export default shopProductsRoute;
