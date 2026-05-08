import { createRoute } from "@tanstack/react-router";
import ShopProductsPage from "../pages/shopProducts";
import { rootRoute } from "./__root";

const shopProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/products",
  component: ShopProductsPage,
});

export default shopProductsRoute;
