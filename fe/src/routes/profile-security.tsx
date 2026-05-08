import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import ProfileSecurityPage from "../pages/profileSecurity";

const profileSecurityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/security",
  component: ProfileSecurityPage,
});

export default profileSecurityRoute;
