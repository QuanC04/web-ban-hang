import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import SellerWorkspaceLayout from "../component/sellerWorkspaceLayout";
import { getShopOrders, updateOrderStatus } from "../api/order";
import type { Order, OrderStatus } from "../models/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng...",
  paid: "Đang giao hàng...",
  delivered: "Đã giao thành công",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipping: "bg-indigo-100 text-indigo-800 border-indigo-200",
  paid: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

const FILTER_TABS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export const ShopOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStatus, setActiveStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchOrders = useCallback(async (page: number, status?: string) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await getShopOrders(page, 10, status || undefined);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1, activeStatus);
  }, [fetchOrders, activeStatus]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    confirmMessage?: string,
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsUpdating(orderId);
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders(pagination.page, activeStatus);
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.",
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const orderIdMatch = order.id.toLowerCase().includes(query);
    const customerName =
      order.user?.full_name?.toLowerCase() || "";
    let shippingName = "";
    try {
      const parsed = JSON.parse(order.shipping_address);
      shippingName = parsed.name?.toLowerCase() || "";
    } catch {}
    return (
      orderIdMatch ||
      customerName.includes(query) ||
      shippingName.includes(query)
    );
  });

  return (
    <SellerWorkspaceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a]">
              Quản lý đơn hàng
            </h1>
            <p className="mt-1 text-[#64748b]">
              Theo dõi, xác nhận và xử lý giao vận các đơn hàng của cửa hàng
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => fetchOrders(pagination.page, activeStatus)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] shadow-sm transition hover:bg-[#fff7ed] disabled:opacity-50">
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin text-amber-600" : ""}`}
            />
            Làm mới
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeStatus === tab.value
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-[#64748b] hover:bg-[#f1f5f9]"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-9 pr-4 text-sm outline-none transition focus:border-[#fcd34d] focus:bg-white"
            />
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white py-20">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-[#fcd34d]" />
              <p className="text-sm text-[#64748b]">
                Đang tải danh sách đơn hàng...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-rose-500" />
            <p className="text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => fetchOrders(pagination.page, activeStatus)}
              className="mt-4 rounded-full bg-[#0f172a] px-5 py-2 text-sm text-white hover:bg-[#334155]">
              Thử lại
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white py-20 text-center shadow-sm">
            <ShoppingBag className="mb-4 h-16 w-16 text-[#cbd5e1]" />
            <h3 className="text-lg font-bold text-[#0f172a]">
              Không có đơn hàng nào
            </h3>
            <p className="mt-1 text-sm text-[#64748b]">
              {activeStatus
                ? `Hiện không có đơn hàng nào ở trạng thái "${STATUS_LABELS[activeStatus as OrderStatus] || activeStatus}".`
                : "Chưa có đơn hàng nào được ghi nhận trong hệ thống."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = order.status as OrderStatus;
              const isItemUpdating = isUpdating === order.id;
              const shippingAddr = (() => {
                try {
                  return JSON.parse(order.shipping_address);
                } catch {
                  return null;
                }
              })();

              const customerName =
                shippingAddr?.name ||
                order.user?.full_name ||
                "Khách hàng";
              const customerPhone =
                shippingAddr?.phone_number ||
                order.user?.phone_number ||
                "Chưa có SĐT";
              const customerAddress = [
                shippingAddr?.street,
                shippingAddr?.district,
                shippingAddr?.province,
              ]
                .filter(Boolean)
                .join(", ");

              const paymentMethod =
                order.payments?.[0]?.payment_method === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Chuyển khoản ngân hàng";

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm transition-hover hover:border-[#cbd5e1]">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] bg-[#f8fafc]/60 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
                        <Package className="h-5 w-5 text-[#0f172a]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-[#0f172a]">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-xs text-[#94a3b8]">
                            ({order.id})
                          </span>
                        </div>
                        <p className="text-xs text-[#64748b]">
                          Đặt lúc: {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3.5 py-1 text-xs font-semibold ${
                          STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700 border-gray-200"
                        }`}>
                        {STATUS_LABELS[status] ?? status}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Shipping Info */}
                  <div className="grid grid-cols-1 border-b border-[#e2e8f0] p-6 lg:grid-cols-2 gap-6 bg-white">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Thông tin khách hàng
                      </p>
                      <div className="flex items-start gap-2.5 text-sm text-[#0f172a]">
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                        <div>
                          <p className="font-semibold">{customerName}</p>
                          <p className="text-xs text-[#64748b]">
                            SĐT: {customerPhone}
                          </p>
                          {order.user?.email && (
                            <p className="text-xs text-[#64748b]">
                              Email: {order.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Địa chỉ giao hàng & Thanh toán
                      </p>
                      <div className="flex items-start gap-2.5 text-sm text-[#0f172a]">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                        <div>
                          <p className="text-sm font-medium">
                            {customerAddress || "Chưa có địa chỉ chi tiết"}
                          </p>
                          <p className="mt-1 text-xs text-[#64748b]">
                            Phương thức:{" "}
                            <span className="font-semibold text-[#0f172a]">
                              {paymentMethod}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Products */}
                  <div className="px-6 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                      Sản phẩm trong đơn ({order.items.length})
                    </p>
                    <div className="divide-y divide-[#f1f5f9]">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 py-3">
                          <img
                            src={
                              item.product.image_url ||
                              "https://via.placeholder.com/56?text=SP"
                            }
                            alt={item.product.name}
                            className="h-14 w-14 rounded-xl border border-[#e2e8f0] object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0f172a]">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-[#64748b]">
                              {formatCurrency(item.price_at_purchase)} ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-[#0f172a]">
                            {formatCurrency(
                              item.price_at_purchase * item.quantity,
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Summary & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e2e8f0] bg-[#f8fafc]/80 px-6 py-4">
                    <div>
                      <p className="text-xs text-[#64748b]">Tổng thanh toán</p>
                      <p className="text-xl font-extrabold text-[#0f172a]">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* ACTION: PENDING -> CONFIRMED */}
                      {status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={isItemUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                "confirmed",
                                "Xác nhận tiếp nhận và chuẩn bị đơn hàng này?",
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50">
                            <CheckCircle2 className="h-4 w-4" />
                            {isItemUpdating ? "Đang xử lý..." : "Xác nhận đơn"}
                          </button>
                          <button
                            type="button"
                            disabled={isItemUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                "cancelled",
                                "Hủy đơn hàng này? Số lượng tồn kho của các sản phẩm sẽ được tự động hoàn lại.",
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">
                            <XCircle className="h-4 w-4" />
                            Hủy đơn
                          </button>
                        </>
                      )}

                      {/* ACTION: CONFIRMED -> SHIPPING */}
                      {status === "confirmed" && (
                        <>
                          <button
                            type="button"
                            disabled={isItemUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                "shipping",
                                "Bàn giao gói hàng cho đơn vị vận chuyển?",
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50">
                            <Truck className="h-4 w-4" />
                            {isItemUpdating
                              ? "Đang xử lý..."
                              : "Giao cho vận chuyển"}
                          </button>
                          <button
                            type="button"
                            disabled={isItemUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                "cancelled",
                                "Hủy đơn hàng này? Số lượng tồn kho sẽ được hoàn trả tự động.",
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">
                            <XCircle className="h-4 w-4" />
                            Hủy đơn
                          </button>
                        </>
                      )}

                      {/* ACTION: SHIPPING -> DELIVERED */}
                      {status === "shipping" && (
                        <>
                          <span className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium bg-indigo-50 border border-indigo-200 rounded-full px-3.5 py-1.5">
                            <Truck className="h-4 w-4" />
                            Đang trên đường giao đến khách
                          </span>
                          <button
                            type="button"
                            disabled={isItemUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                "delivered",
                                "Xác nhận kiện hàng đã giao thành công tới tay khách hàng?",
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50">
                            <CheckCircle2 className="h-4 w-4" />
                            Xác nhận đã giao
                          </button>
                        </>
                      )}

                      {status === "delivered" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Đơn hàng đã hoàn thành
                        </span>
                      )}

                      {status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                          <XCircle className="h-4 w-4 text-rose-500" />
                          Đơn hàng đã bị hủy (Kho đã hoàn)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => fetchOrders(pagination.page - 1, activeStatus)}
              className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#0f172a] shadow-sm transition hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40">
              Trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => fetchOrders(p, activeStatus)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    p === pagination.page
                      ? "bg-[#0f172a] text-white shadow-sm"
                      : "border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9]"
                  }`}>
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchOrders(pagination.page + 1, activeStatus)}
              className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#0f172a] shadow-sm transition hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40">
              Sau
            </button>
          </div>
        )}
      </div>
    </SellerWorkspaceLayout>
  );
};

export default ShopOrdersPage;
