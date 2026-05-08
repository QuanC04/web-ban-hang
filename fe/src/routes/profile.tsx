import { createRoute } from "@tanstack/react-router";
import ProfilePage from "../pages/profile";
import { rootRoute } from "./__root";

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

export default profileRoute;
