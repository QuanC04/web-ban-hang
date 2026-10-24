import { createRoute } from "@tanstack/react-router";
import ResetPasswordPage from "../pages/resetPassword";
import { rootRoute } from "./__root";

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

export default resetPasswordRoute;
