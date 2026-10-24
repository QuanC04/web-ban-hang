import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Package, ShoppingBag } from "lucide-react";
import ProfileLayout from "../component/profileLayout";
import ReviewModal from "../component/reviewModal";
import { getMyOrders } from "../api/order";
import type { Order, OrderStatus } from "../models/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
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

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<{ id: string; name: string; image_url?: string | null } | null>(null);
  const [reviewedItemIds, setReviewedItemIds] = useState<string[]>([]);
  const shippingAddr = (() => {
    try {
      return JSON.parse(order.shipping_address);
    } catch {
      return null;
    }
  })();
  const status = order.status as OrderStatus;


  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] px-5 py-4">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-[#64748b]" />
          <div>
            <p className="text-xs text-[#64748b]">Mã đơn hàng</p>
            <p className="font-mono text-sm font-semibold text-[#0f172a]">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
          <p className="text-xs text-[#64748b]">
            {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item) => (
            <img
              key={item.id}
              src={
                item.product.image_url ||
                "https://via.placeholder.com/48?text=SP"
              }
              alt={item.product.name}
              className="h-12 w-12 rounded-xl border-2 border-white object-cover shadow-sm"
            />
          ))}
          {order.items.length > 3 && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-[#f1f5f9] text-xs font-semibold text-[#64748b] shadow-sm">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#0f172a]">
            {order.items[0]?.product.name}
            {order.items.length > 1 && (
              <span className="text-[#64748b]">
                {" "}
                và {order.items.length - 1} sản phẩm khác
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-[#64748b]">
            {order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-[#64748b]">Tổng tiền</p>
          <p className="font-bold text-[#0f172a]">
            {formatCurrency(order.total_amount)}
          </p>
          {order.total_before_discount > order.total_amount && (
            <p className="text-xs text-[#64748b] line-through">
              {formatCurrency(order.total_before_discount)}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-1 border-t border-[#e2e8f0] py-2 text-sm text-[#64748b] transition hover:bg-[#f8fafc]">
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" /> Ẩn chi tiết
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" /> Xem chi tiết
          </>
        )}
      </button>

      {expanded && (
        <div className="border-t border-[#e2e8f0] px-5 pb-5 pt-4">
          <p className="mb-3 text-sm font-semibold text-[#0f172a]">
            Danh sách sản phẩm
          </p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] p-3">
                <img
                  src={
                    item.product.image_url ||
                    "https://via.placeholder.com/56?text=SP"
                  }
                  alt={item.product.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#0f172a]">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {formatCurrency(item.price_at_purchase)} x {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <p className="text-sm font-semibold text-[#0f172a]">
                    {formatCurrency(item.price_at_purchase * item.quantity)}
                  </p>
                  {status === "delivered" && (
                    reviewedItemIds.includes(item.id) ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-200">
                        Đã đánh giá
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewingItem({
                            id: item.id,
                            name: item.product.name,
                            image_url: item.product.image_url,
                          })
                        }
                        className="rounded-full border border-[#0f172a] px-3 py-1 text-xs font-semibold text-[#0f172a] transition hover:bg-[#0f172a] hover:text-white">
                        Đánh giá
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 rounded-xl bg-[#f8fafc] p-4 text-sm">
            <div className="flex justify-between text-[#64748b]">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.total_before_discount)}</span>
            </div>
            {order.total_before_discount > order.total_amount && (
              <div className="flex justify-between text-emerald-600">
                <span>Giảm giá</span>
                <span>
                  -
                  {formatCurrency(
                    order.total_before_discount - order.total_amount,
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[#64748b]">
              <span>Phí vận chuyển</span>
              <span>22.000 ₫</span>
            </div>
            <div className="flex justify-between border-t border-[#e2e8f0] pt-2 font-bold text-[#0f172a]">
              <span>Tổng cộng</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {shippingAddr && (
            <div className="mt-4 rounded-xl border border-[#e2e8f0] p-4 text-sm">
              <p className="mb-1 font-semibold text-[#0f172a]">
                Địa chỉ giao hàng
              </p>
              <p className="text-[#64748b]">
                {shippingAddr.name} · {shippingAddr.phone_number}
              </p>
              <p className="text-[#64748b]">
                {[
                  shippingAddr.street,
                  shippingAddr.district,
                  shippingAddr.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
      {reviewingItem && (
        <ReviewModal
          isOpen={!!reviewingItem}
          onClose={() => setReviewingItem(null)}
          orderItemId={reviewingItem.id}
          productName={reviewingItem.name}
          productImage={reviewingItem.image_url || undefined}
          useRealApi={false}
          onSuccess={() => {
            if (reviewingItem) {
              setReviewedItemIds((prev) => [...prev, reviewingItem.id]);
            }
          }}
        />
      )}
    </div>
  );
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [activeStatus, setActiveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async (page: number, status: string) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await getMyOrders(page, 10, status || undefined);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch {
      setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, activeStatus);
  }, [activeStatus]);

  return (
    <ProfileLayout title="Lịch sử đơn hàng">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <h2 className="mb-1 text-2xl font-bold text-[#0f172a]">
            Lịch sử đơn hàng
          </h2>
          <p className="text-sm text-[#64748b]">
            Tổng {pagination.total} đơn hàng
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-2">
          <div className="flex flex-wrap gap-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeStatus === tab.value ? "bg-[#0f172a] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white py-16">
            <p className="animate-pulse text-[#64748b]">Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
            <p className="text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => fetchOrders(pagination.page, activeStatus)}
              className="mt-3 rounded-full bg-[#0f172a] px-5 py-2 text-sm text-white hover:bg-[#334155]">
              Thử lại
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white py-16 text-center">
            <ShoppingBag className="mb-4 h-14 w-14 text-[#cbd5e1]" />
            <p className="font-semibold text-[#0f172a]">Chưa có đơn hàng nào</p>
            <p className="mt-1 text-sm text-[#64748b]">
              Hãy khám phá và mua sắm ngay!
            </p>
            <Link
              to="/"
              className="mt-4 rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#334155]">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => fetchOrders(pagination.page - 1, activeStatus)}
              className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm font-medium text-[#0f172a] transition hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40">
              Trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => fetchOrders(p, activeStatus)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${p === pagination.page ? "bg-[#0f172a] text-white" : "border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]"}`}>
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchOrders(pagination.page + 1, activeStatus)}
              className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm font-medium text-[#0f172a] transition hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40">
              Sau
            </button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default OrderHistoryPage;
