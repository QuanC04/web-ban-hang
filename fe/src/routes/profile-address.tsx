import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import ProfileAddressPage from "../pages/profileAddress";

const profileAddressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/address",
  component: ProfileAddressPage,
});

export default profileAddressRoute;
