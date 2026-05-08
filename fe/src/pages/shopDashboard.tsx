import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Boxes,
  CircleDollarSign,
  Clock,
  Eye,
  FileText,
  PackageSearch,
  Plus,
  Settings,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import AddProductModal from "../component/addProductModal";
import SellerWorkspaceLayout from "../component/sellerWorkspaceLayout";
import { useUserStore } from "../store/user";

const stats = [
  {
    label: "Doanh thu tháng này",
    value: "12.450.000đ",
    change: "+12.5%",
    trend: "up",
    icon: CircleDollarSign,
    tone: "bg-green-500",
  },
  {
    label: "Đơn hàng mới",
    value: "24",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    tone: "bg-blue-500",
  },
  {
    label: "Sản phẩm đang bán",
    value: "156",
    change: "-2.1%",
    trend: "down",
    icon: Boxes,
    tone: "bg-[#fcd34d]",
  },
  {
    label: "Lượt xem cửa hàng",
    value: "3.245",
    change: "+15.8%",
    trend: "up",
    icon: Eye,
    tone: "bg-[#0f172a]",
  },
];

const additionalStats = [
  { label: "Tỷ lệ hoàn thành đơn", value: "98.5%", icon: BarChart3 },
  { label: "Đánh giá trung bình", value: "4.8/5", icon: Star },
  { label: "Thời gian phản hồi", value: "< 2h", icon: Clock },
  { label: "Người theo dõi", value: "3.456", icon: Users },
];

const recentOrders = [
  {
    id: "ORD-2026-001",
    customer: "Nguyễn Thị B",
    product: "Nhà Giả Kim",
    amount: 79000,
    status: "Chờ xử lý",
    date: "25/04/2026",
  },
  {
    id: "ORD-2026-002",
    customer: "Trần Văn C",
    product: "Sapiens",
    amount: 189000,
    status: "Đang giao",
    date: "25/04/2026",
  },
  {
    id: "ORD-2026-003",
    customer: "Lê Thị D",
    product: "Đắc Nhân Tâm",
    amount: 65000,
    status: "Hoàn thành",
    date: "24/04/2026",
  },
];

const topProducts = [
  { name: "Atomic Habits", sold: 86, stock: 24, revenue: 17114000 },
  { name: "Deep Work", sold: 69, stock: 12, revenue: 14421000 },
  { name: "Ikigai", sold: 61, stock: 10, revenue: 10919000 },
];

const notifications = [
  {
    icon: AlertCircle,
    title: "3 sản phẩm sắp hết hàng",
    message: "Cập nhật tồn kho để tránh mất đơn hàng.",
    time: "10 phút trước",
    tone: "border-red-200 bg-red-50 text-red-500",
    action: "Xem chi tiết",
  },
  {
    icon: ShoppingBag,
    title: "5 đơn hàng chờ xác nhận",
    message: "Xác nhận đơn trong vòng 24h để tránh hủy tự động.",
    time: "30 phút trước",
    tone: "border-[#fcd34d] bg-[#fff7ed] text-[#b45309]",
    action: "Xử lý ngay",
  },
  {
    icon: Star,
    title: "Bạn có 3 đánh giá mới",
    message: "Khách hàng đã để lại đánh giá cho cửa hàng.",
    time: "1 giờ trước",
    tone: "border-blue-200 bg-blue-50 text-blue-500",
    action: "Xem đánh giá",
  },
];

const quickActions = [
  { to: "/shop/products", icon: Plus, label: "Thêm sản phẩm" },
  { to: "/shop", icon: FileText, label: "Quản lý đơn", badge: "5" },
  { to: "/shop", icon: BarChart3, label: "Thống kê" },
  { to: "/profile", icon: Settings, label: "Cài đặt" },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const ShopDashboardPage = () => {
  const { user } = useUserStore();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const sellerName = user?.full_name || "Bookora Seller";

  return (
    <SellerWorkspaceLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[#0f172a]">Dashboard</h1>
          <p className="text-[#64748b]">Chào mừng quay lại, {sellerName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="relative rounded-xl border border-[#e2e8f0] bg-white p-3 transition-colors hover:bg-[#fff7ed]"
            aria-label="Thông báo">
            <Bell className="h-5 w-5 text-[#0f172a]" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              8
            </span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#fff7ed]">
            <PackageSearch className="h-5 w-5" />
            Xử lý đơn chờ
          </button>
          <button
            type="button"
            onClick={() => setIsAddProductModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#334155]">
            <Plus className="h-5 w-5" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trend === "up";
          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone}`}>
                  <Icon
                    className={`h-6 w-6 ${stat.tone === "bg-[#fcd34d]" ? "text-[#0f172a]" : "text-white"}`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${
                    isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {isUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="mb-1 text-3xl font-bold text-[#0f172a]">
                {stat.value}
              </p>
              <p className="text-sm text-[#64748b]">{stat.label}</p>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {additionalStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="rounded-xl border border-[#e2e8f0] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff7ed]">
                  <Icon className="h-5 w-5 text-[#b45309]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#0f172a]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#64748b]">{stat.label}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <article className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <h2 className="mb-6 text-xl font-bold text-[#0f172a]">
              Biểu đồ doanh thu 7 ngày
            </h2>
            <div className="flex h-64 items-end justify-around gap-4">
              {[
                { day: "T2", value: 65 },
                { day: "T3", value: 45 },
                { day: "T4", value: 80 },
                { day: "T5", value: 55 },
                { day: "T6", value: 90 },
                { day: "T7", value: 70 },
                { day: "CN", value: 75 },
              ].map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center">
                  <div
                    className="w-full cursor-pointer rounded-t-lg bg-[#fcd34d] transition-colors hover:bg-[#0f172a]"
                    style={{ height: `${item.value}%` }}
                  />
                  <p className="mt-3 text-sm font-medium text-[#64748b]">
                    {item.day}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-[#0f172a]">
                Đơn hàng gần đây
              </h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-4 transition-colors hover:border-[#fcd34d]">
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 font-bold text-[#0f172a]">{order.id}</p>
                      <p className="mb-1 text-sm text-[#64748b]">
                        {order.customer} • {order.product}
                      </p>
                      <p className="text-sm text-[#64748b]">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="mb-2 font-bold text-[#0f172a]">
                        {formatPrice(order.amount)}
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "Chờ xử lý"
                            ? "bg-[#fde68a] text-[#0f172a]"
                            : order.status === "Đang giao"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-[#0f172a]">
                Sản phẩm bán chạy
              </h2>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] p-4 transition-colors hover:border-[#fcd34d]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fcd34d] font-bold text-[#0f172a]">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 font-bold text-[#0f172a]">
                        {product.name}
                      </p>
                      <p className="text-sm text-[#64748b]">
                        Đã bán: {product.sold} • Tồn: {product.stock}
                      </p>
                    </div>
                    <p className="text-right font-bold text-[#0f172a]">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <h2 className="mb-6 text-xl font-bold text-[#0f172a]">
              Truy cập nhanh
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={`${action.to}-${action.label}`}
                    to={action.to}
                    className="group relative flex flex-col items-center gap-3 rounded-xl border border-[#e2e8f0] p-4 transition-colors hover:border-[#fcd34d] hover:bg-[#fff7ed]">
                    {action.badge ? (
                      <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        {action.badge}
                      </span>
                    ) : null}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7ed] transition-colors group-hover:bg-[#fcd34d]">
                      <Icon className="h-6 w-6 text-[#0f172a]" />
                    </div>
                    <span className="text-center text-sm font-medium text-[#0f172a]">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0f172a]">Thông báo</h2>
              <button
                type="button"
                className="text-sm font-medium text-[#0f172a] hover:text-[#334155]">
                Xem tất cả
              </button>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.title}
                    className={`rounded-xl border p-4 ${notification.tone}`}>
                    <div className="flex gap-3">
                      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="font-bold text-[#0f172a]">
                            {notification.title}
                          </p>
                          <span className="flex-shrink-0 text-xs text-[#64748b]">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-[#64748b]">
                          {notification.message}
                        </p>
                        <button
                          type="button"
                          className="text-sm font-medium text-[#0f172a] hover:underline">
                          {notification.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </aside>
      </div>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />
    </SellerWorkspaceLayout>
  );
};

export default ShopDashboardPage;
