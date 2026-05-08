import { createRoute } from "@tanstack/react-router";
import CheckoutPage from "../pages/checkout";
import { rootRoute } from "./__root";

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

export default checkoutRoute;
