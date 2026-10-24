import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import OrderHistoryPage from "../pages/orderHistory";

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/orders",
  component: OrderHistoryPage,
});

export default orderHistoryRoute;

