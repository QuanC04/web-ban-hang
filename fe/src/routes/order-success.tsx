import { createRoute } from "@tanstack/react-router";
import OrderSuccessPage from "../pages/orderSuccess";
import { rootRoute } from "./__root";

const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-success",
  component: OrderSuccessPage,
});

export default orderSuccessRoute;
