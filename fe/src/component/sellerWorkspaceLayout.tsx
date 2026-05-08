import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Boxes, LayoutDashboard, Store } from "lucide-react";
import type { ReactNode } from "react";

interface SellerWorkspaceLayoutProps {
  children: ReactNode;
}

const sellerNavItems = [
  { label: "Tổng quan", icon: LayoutDashboard, path: "/shop" },
  { label: "Sản phẩm", icon: Boxes, path: "/shop/products" },
  { label: "Cửa hàng", icon: Store, path: "/shops/my-shop" },
];

const SellerWorkspaceLayout = ({ children }: SellerWorkspaceLayoutProps) => {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isActivePath = (path: string) => {
    if (path === "/shop") return pathname === "/shop";
    return pathname.startsWith(path);
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#0f172a]">
      <div className="flex">
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 flex-shrink-0 border-r border-[#e2e8f0] bg-white md:block">
          <nav className="space-y-2 p-4">
            {sellerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              const isShopStore = item.path === "/shops/my-shop";

              if (isShopStore) {
                return (
                  <Link
                    key={item.path}
                    to="/shops/$shopId"
                    params={{ shopId: "my-shop" }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-[#fff7ed] font-medium text-[#0f172a]"
                        : "text-[#64748b] hover:bg-[#f1f5f9]"
                    }`}>
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate({ to: item.path })}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[#fff7ed] font-medium text-[#0f172a]"
                      : "text-[#64748b] hover:bg-[#f1f5f9]"
                  }`}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 space-y-6 p-4 md:p-8">
          {children}
        </section>
      </div>
    </main>
  );
};

export default SellerWorkspaceLayout;
