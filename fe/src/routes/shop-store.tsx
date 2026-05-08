import { createRoute } from "@tanstack/react-router";
import ShopStorePage from "../pages/shopStore";
import { rootRoute } from "./__root";

const shopStoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shops/$shopId",
  component: () => {
    const { shopId } = shopStoreRoute.useParams();
    return <ShopStorePage shopId={shopId} />;
  },
});

export default shopStoreRoute;
