import { MapPin, Shield, User } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useUserStore } from "../store/user";

type ProfileNavItem = {
  key: "overview" | "profile" | "address" | "security";
  label: string;
  icon: typeof User;
  path: "/profile" | "/profile/address" | "/profile/security";
};

type ProfileLayoutProps = {
  title?: string;
  children: ReactNode;
};

const navItems: ProfileNavItem[] = [
  {
    key: "profile",
    label: "Thông tin cá nhân",
    icon: User,
    path: "/profile",
  },
  {
    key: "address",
    label: "Địa chỉ",
    icon: MapPin,
    path: "/profile/address",
  },
  {
    key: "security",
    label: "Bảo mật",
    icon: Shield,
    path: "/profile/security",
  },
];

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
};

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="md:col-span-1">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e2e8f0] pb-6">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#fcd34d]">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || "User avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-[#0f172a]">
                    {getInitials(user?.full_name)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#0f172a]">
                  {user?.full_name || "Người dùng Bookora"}
                </p>
                <p className="truncate text-sm text-[#64748b]">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.key}
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
          </div>
        </aside>

        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
