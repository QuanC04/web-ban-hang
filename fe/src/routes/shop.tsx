import { createRoute } from "@tanstack/react-router";
import ShopDashboardPage from "../pages/shopDashboard";
import { rootRoute } from "./__root";

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopDashboardPage,
});

export default shopRoute;
