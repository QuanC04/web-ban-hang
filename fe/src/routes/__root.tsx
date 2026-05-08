import * as React from "react";
import { useEffect } from "react";
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { useUserStore } from "../store/user";
import Cookies from "js-cookie";
import { getMe } from "../api/user";
import SiteLayout from "../component/siteLayout";

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { setUser, setLoading, isLoading } = useUserStore();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const hideSiteLayout = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const bootstrap = async () => {
      const token = Cookies.get("token");

      // Chỉ gọi getMe nếu thực sự có token
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getMe();
        if (data) {
          const user = data.data || data;
          setUser(user);
        }
      } catch (error: any) {
        console.error(
          "Lỗi khi khôi phục phiên đăng nhập:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [setUser, setLoading]);

  // Có thể thêm hiệu ứng loading toàn trang ở đây nếu đang checking session
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="animate-pulse text-lg font-medium">Đang tải...</p>
      </div>
    );
  }

  if (hideSiteLayout) {
    return <Outlet />;
  }

  return (
    <React.Fragment>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    </React.Fragment>
  );
}
