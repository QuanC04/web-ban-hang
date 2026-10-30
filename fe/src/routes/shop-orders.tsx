import { createRoute } from "@tanstack/react-router";
import ShopOrdersPage from "../pages/shopOrders";
import { rootRoute } from "./__root";
import AdminRouteGuard from "../component/adminGuard";

const shopOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/orders",
  component: () => (
    <AdminRouteGuard>
      <ShopOrdersPage />
    </AdminRouteGuard>
  ),
});

export default shopOrdersRoute;
