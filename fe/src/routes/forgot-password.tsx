import { createRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "../pages/forgotPassword";
import { rootRoute } from "./__root";

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

export default forgotPasswordRoute;
