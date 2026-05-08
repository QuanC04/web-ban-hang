import { createRoute } from "@tanstack/react-router";
import HomePage from "../pages/home";
import { rootRoute } from "./__root";

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export default homeRoute;
