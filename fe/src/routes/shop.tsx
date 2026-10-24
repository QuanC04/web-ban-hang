import { createRoute } from "@tanstack/react-router";
import ShopDashboardPage from "../pages/shopDashboard";
import { rootRoute } from "./__root";
import AdminRouteGuard from "../component/adminGuard";

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: () => (
    <AdminRouteGuard>
      <ShopDashboardPage />
    </AdminRouteGuard>
  ),
});

export default shopRoute;
