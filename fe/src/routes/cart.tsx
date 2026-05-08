import { createRoute } from "@tanstack/react-router";
import CartPage from "../pages/cart";
import { rootRoute } from "./__root";

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

export default cartRoute;
