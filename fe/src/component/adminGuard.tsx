import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUserStore } from "../store/user";

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUserStore();

  useEffect(() => {
    if (!isLoading && user?.role?.toLowerCase() !== "admin") {
      navigate({ to: "/" });
    }
  }, [isLoading, user, navigate]);

  if (isLoading || user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
