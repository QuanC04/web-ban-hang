import { createRoute } from "@tanstack/react-router";
import VerifyOtpPage from "../pages/verifyOtp";
import { rootRoute } from "./__root";

const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-otp",
  component: VerifyOtpPage,
});

export default verifyOtpRoute;
