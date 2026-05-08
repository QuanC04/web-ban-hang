import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Menu, Phone, Search, ShoppingCart, User } from "lucide-react";
import Cookies from "js-cookie";
import { useUserStore } from "../store/user";
import { authLogout } from "../api/auth";
import { useSearchStore } from "../store/search";
import { useCartStore } from "../store/cart";

interface SiteLayoutProps {
  children: ReactNode;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words
    .map((word) => word[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
};

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState("");
  const setQuery = useSearchStore((state) => state.setQuery);
  const cartCount = useCartStore((state) => state.cartCount);
  const { user, logout } = useUserStore();
  const profilePath =
    user?.role?.toLowerCase() === "shop" ? "/shop" : "/profile";

  const handleLogout = async () => {
    try {
      await authLogout();
    } finally {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      logout();
      navigate({ to: "/login" });
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(queryInput);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fff7ed] text-[#0f172a]">
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold text-[#0f172a]">
              Bookora
            </Link>

            <div className="hidden flex-1 md:flex md:max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(event) => setQueryInput(event.target.value)}
                  placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
                  className="w-full rounded-full border border-[#e2e8f0] bg-[#fff7ed] px-4 py-3 pr-12 text-sm text-[#0f172a] outline-none transition focus:ring-2 focus:ring-[#fcd34d]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0f172a] p-2 text-white transition hover:bg-[#334155]"
                  aria-label="Tìm kiếm">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate({ to: "/cart" })}
                className="relative rounded-full p-2 transition hover:bg-[#fff7ed]"
                title="Giỏ hàng">
                <ShoppingCart className="h-6 w-6 text-[#0f172a]" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fcd34d] text-xs font-bold text-[#0f172a]">
                  {cartCount}
                </span>
              </button>

              {user ? (
                <>
                  <Link
                    to={profilePath}
                    className="hidden items-center gap-2 rounded-full px-4 py-2 transition hover:bg-[#fff7ed] md:flex"
                    title="Trang cá nhân">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || "User avatar"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f172a] text-xs font-bold text-[#fcd34d]">
                        {getInitials(user.full_name)}
                      </span>
                    )}
                    <span className="max-w-24 truncate text-sm text-[#0f172a]">
                      {user.full_name || "Hồ sơ"}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hidden rounded-full px-4 py-2 text-sm text-[#0f172a] transition hover:bg-[#fff7ed] md:inline-flex"
                    title="Đăng xuất">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden items-center gap-2 rounded-full px-4 py-2 text-[#0f172a] transition hover:bg-[#fff7ed] md:flex">
                    <User className="h-5 w-5" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="hidden rounded-full bg-[#0f172a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#334155] md:inline-flex">
                    Đăng ký
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => navigate({ to: "/", hash: "collections" })}
                className="p-2 md:hidden"
                title="Danh mục">
                <Menu className="h-6 w-6 text-[#0f172a]" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative mt-4 md:hidden">
            <input
              type="text"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Tìm kiếm sách..."
              className="w-full rounded-full border border-[#e2e8f0] bg-[#fff7ed] px-4 py-3 pr-12 text-sm text-[#0f172a] outline-none focus:ring-2 focus:ring-[#fcd34d]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0f172a] p-2 text-white"
              aria-label="Tìm kiếm">
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-auto border-t border-[#e2e8f0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold text-[#0f172a]">Bookora</h3>
              <p className="text-sm leading-relaxed text-[#64748b]">
                Nền tảng thương mại điện tử sách hàng đầu Việt Nam. Kết nối
                người mua và người bán sách trên toàn quốc.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-[#0f172a]">Về Bookora</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li>
                  <Link to="/" className="hover:text-[#0f172a]">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-[#0f172a]">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-[#0f172a]">
                    Nhà bán hàng
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-[#0f172a]">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li>
                  <Link to="/cart" className="hover:text-[#0f172a]">
                    Giỏ hàng
                  </Link>
                </li>
                <li>
                  <Link to="/checkout" className="hover:text-[#0f172a]">
                    Thanh toán
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-[#0f172a]">
                    Tài khoản
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-[#0f172a]">Liên hệ</h4>
              <ul className="space-y-3 text-sm text-[#64748b]">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>1900 1234</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@bookora.vn</span>
                </li>
                <li className="mt-4 flex items-center gap-3">
                  <a
                    href="https://facebook.com"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7ed] text-sm font-bold text-[#0f172a] transition hover:bg-[#fcd34d]">
                    f
                  </a>
                  <a
                    href="https://instagram.com"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7ed] text-sm font-bold text-[#0f172a] transition hover:bg-[#fcd34d]">
                    in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-[#e2e8f0] pt-8 text-center">
            <p className="text-sm text-[#64748b]">
              © 2026 Bookora. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
