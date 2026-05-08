import { createRoute } from "@tanstack/react-router";
import LoginForm from "../pages/login";
import { rootRoute } from "./__root";

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginForm,
});

export default loginRoute;
