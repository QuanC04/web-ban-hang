import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Home,
  Minus,
  Plus,
  Receipt,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useCartStore } from "../store/cart";
import { deleteCartItem, updateCartItem } from "../api/cart";
import type { CartItem } from "../models/cart";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

interface ShopGroup {
  shopId: string;
  shopName: string;
  items: CartItem[];
}

const groupCartItemsByShop = (items: CartItem[]): ShopGroup[] => {
  const groups = new Map<string, ShopGroup>();

  items.forEach((item) => {
    const shopName = item.product.user.full_name || "Bookora Shop";
    const shopId = shopName;
    const group = groups.get(shopId);

    if (group) {
      group.items.push(item);
      return;
    }

    groups.set(shopId, { shopId, shopName, items: [item] });
  });

  return Array.from(groups.values());
};

const CartPage = () => {
  const navigate = useNavigate();
  const cartRows = useCartStore((state) => state.cartItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const setcheckoutCartItemsIds = useCartStore(
    (state) => state.setCheckoutCartItemsIds,
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>(
    {},
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };
    loadCart();
  }, [fetchCart]);

  const shopGroups = groupCartItemsByShop(cartRows);
  const allSelected = cartRows.length > 0 && selectedIds.length === cartRows.length;
  const selectedCartRows = cartRows.filter((row) => selectedIds.includes(row.id));
  const subtotal = selectedCartRows.reduce(
    (sum, row) => sum + row.product.base_price * row.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 150000 ? 0 : 30000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : cartRows.map((row) => row.id));
  };

  const toggleSelectShop = (shopId: string) => {
    const shopItemIds = shopGroups
      .find((group) => group.shopId === shopId)
      ?.items.map((item) => item.id);

    if (!shopItemIds) return;

    const allShopItemsSelected = shopItemIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allShopItemsSelected
        ? prev.filter((id) => !shopItemIds.includes(id))
        : [...prev, ...shopItemIds.filter((id) => !prev.includes(id))],
    );
  };

  const toggleSelectItem = (cartItemsId: string) => {
    setSelectedIds((prev) =>
      prev.includes(cartItemsId)
        ? prev.filter((id) => id !== cartItemsId)
        : [...prev, cartItemsId],
    );
  };

  const handleCheckout = (cartItemsIds: string[]) => {
    if (!cartItemsIds.length) return;
    setcheckoutCartItemsIds(cartItemsIds);
    navigate({ to: "/checkout" });
  };

  const handleRemoveItem = async (itemId: string) => {
    await deleteCartItem(itemId);
    setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    await fetchCart();
  };

  const handleRemoveSelectedItems = async () => {
    if (!selectedIds.length) return;

    await Promise.all(selectedIds.map((itemId) => deleteCartItem(itemId)));
    setSelectedIds([]);
    await fetchCart();
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      const shouldDelete = window.confirm(
        "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
      );

      if (!shouldDelete) return;

      await handleRemoveItem(itemId);
      return;
    }

    await updateCartItem(itemId, quantity);
    await fetchCart();
  };

  const handleQuantityInputChange = (itemId: string, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setQuantityDrafts((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleQuantityInputCommit = async (
    itemId: string,
    currentQuantity: number,
  ) => {
    const draft = quantityDrafts[itemId];
    if (draft === undefined) return;

    const nextQuantity = Number(draft);
    setQuantityDrafts((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });

    if (
      !draft ||
      Number.isNaN(nextQuantity) ||
      nextQuantity === currentQuantity
    ) {
      return;
    }

    await handleUpdateQuantity(itemId, nextQuantity);
  };

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;

    setVoucherApplied(true);
    window.setTimeout(() => setVoucherApplied(false), 2000);
  };

  if (cartRows.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#fff7ed]">
            <ShoppingBag className="h-12 w-12 text-[#64748b]" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-[#0f172a]">
            Giỏ hàng trống
          </h2>
          <p className="mb-6 text-[#64748b]">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Link
            to="/"
            className="inline-block rounded-full bg-[#0f172a] px-8 py-3 font-medium text-white hover:bg-[#334155]">
            Khám phá sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 md:py-8 lg:pb-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[#64748b]">
        <Link to="/" className="hover:text-[#0f172a]" aria-label="Trang chủ">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-[#0f172a]">Giỏ hàng</span>
      </nav>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a] md:text-3xl">
          Giỏ hàng ({cartRows.length})
        </h1>
        <Link
          to="/"
          className="flex items-center gap-2 font-medium text-[#0f172a] hover:text-[#334155]">
          <span className="hidden sm:inline">Tiếp tục mua sắm</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded border-[#cbd5e1] text-[#fcd34d] focus:ring-[#fcd34d]"
              />
              <span className="font-medium text-[#0f172a]">
                Chọn tất cả ({cartRows.length})
              </span>
            </label>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleRemoveSelectedItems}
                className="flex items-center gap-2 font-medium text-[#dc2626] hover:text-[#991b1b]">
                <Trash2 className="h-5 w-5" />
                <span>Xóa ({selectedIds.length})</span>
              </button>
            )}
          </div>

          {shopGroups.map((group) => {
            const shopItemIds = group.items.map((item) => item.id);
            const allShopItemsSelected = shopItemIds.every((id) =>
              selectedIds.includes(id),
            );

            return (
              <div
                key={group.shopId}
                className="rounded-2xl border border-[#fcd34d] bg-[#fff7ed] p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-[#fcd34d] pb-4">
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={allShopItemsSelected}
                      onChange={() => toggleSelectShop(group.shopId)}
                      className="h-5 w-5 rounded border-[#cbd5e1] text-[#fcd34d] focus:ring-[#fcd34d]"
                    />
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-[#0f172a]" />
                      <span className="font-bold text-[#0f172a]">
                        {group.shopName}
                      </span>
                    </div>
                  </label>
                  <span className="text-sm font-medium text-[#64748b]">
                    {group.items.length} sản phẩm
                  </span>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 transition-colors hover:border-[#fcd34d]">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="mt-1 h-5 w-5 flex-shrink-0 rounded border-[#cbd5e1] text-[#fcd34d] focus:ring-[#fcd34d]"
                      />
                      <Link
                        to="/products/$productId"
                        params={{ productId: item.product.id }}
                        className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#fff7ed] md:h-32 md:w-24">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        ) : null}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex gap-3">
                          <div className="min-w-0 flex-1">
                            <Link
                              to="/products/$productId"
                              params={{ productId: item.product.id }}
                              className="mb-1 line-clamp-2 font-bold text-[#0f172a] hover:text-[#334155]">
                              {item.product.name}
                            </Link>
                            <p className="mb-1 text-sm text-[#64748b]">
                              {item.product.user.full_name}
                            </p>
                            {item.product.category?.name ? (
                              <p className="mb-2 text-xs text-[#64748b]">
                                Phân loại: {item.product.category.name}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="self-start text-[#64748b] transition-colors hover:text-[#dc2626]"
                            aria-label="Xóa sản phẩm">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <p className="text-lg font-bold text-[#0f172a]">
                            {formatPrice(item.product.base_price)}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center overflow-hidden rounded-lg border border-[#e2e8f0]">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="p-2 transition-colors hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Giảm số lượng">
                                <Minus className="h-4 w-4 text-[#0f172a]" />
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={
                                  quantityDrafts[item.id] ?? String(item.quantity)
                                }
                                onChange={(event) =>
                                  handleQuantityInputChange(
                                    item.id,
                                    event.target.value,
                                  )
                                }
                                onBlur={() =>
                                  handleQuantityInputCommit(
                                    item.id,
                                    item.quantity,
                                  )
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.currentTarget.blur();
                                  }
                                }}
                                className="w-[58px] border-x border-[#e2e8f0] px-2 py-2 text-center font-medium outline-none focus:bg-[#fff7ed]"
                                aria-label="Số lượng"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 transition-colors hover:bg-[#f1f5f9]"
                                aria-label="Tăng số lượng">
                                <Plus className="h-4 w-4 text-[#0f172a]" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 hidden text-sm text-[#64748b] sm:block">
                          Tổng: <span className="font-bold text-[#0f172a]">{formatPrice(item.product.base_price * item.quantity)}</span>
                        </p>
                      </div>
                      <div className="text-right sm:hidden">
                        <p className="text-sm text-[#64748b]">Tổng</p>
                        <p className="font-bold text-[#0f172a]">
                          {formatPrice(item.product.base_price * item.quantity)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="lg:hidden">
            <VoucherSection
              code={voucherCode}
              applied={voucherApplied}
              onCodeChange={setVoucherCode}
              onApply={handleApplyVoucher}
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 lg:hidden">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[#64748b]">
                  Đã chọn {selectedIds.length} sản phẩm
                </span>
                <span className="font-bold text-[#0f172a]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCheckout(selectedIds)}
                className="block w-full rounded-full bg-[#0f172a] py-3 text-center font-bold text-white hover:bg-[#334155]">
                Thanh toán
              </button>
            </div>
          )}
        </section>

        <aside className="hidden space-y-6 lg:col-span-1 lg:block">
          <VoucherSection
            code={voucherCode}
            applied={voucherApplied}
            onCodeChange={setVoucherCode}
            onApply={handleApplyVoucher}
          />
          {selectedIds.length > 0 ? (
            <OrderSummarySection
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              itemCount={selectedIds.length}
              onCheckout={() => handleCheckout(selectedIds)}
            />
          ) : (
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center">
              <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-[#64748b]" />
              <p className="text-[#64748b]">
                Chọn sản phẩm để xem tổng giá trị
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e2e8f0] bg-white p-4 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm text-[#64748b]">
              Tổng ({selectedIds.length} sản phẩm)
            </p>
            <p className="text-xl font-bold text-[#0f172a]">
              {formatPrice(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCheckout(selectedIds)}
            disabled={!selectedIds.length}
            className="rounded-full bg-[#0f172a] px-8 py-3 font-bold text-white hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-50">
            Thanh toán
          </button>
        </div>
      </div>
    </main>
  );
};

interface VoucherSectionProps {
  code: string;
  applied: boolean;
  onCodeChange: (code: string) => void;
  onApply: () => void;
}

const VoucherSection = ({
  code,
  applied,
  onCodeChange,
  onApply,
}: VoucherSectionProps) => (
  <div className="rounded-xl border border-[#fcd34d] bg-[#fff7ed] p-4">
    <div className="mb-3 flex items-center gap-2">
      <Tag className="h-5 w-5 text-[#fcd34d]" />
      <h3 className="font-bold text-[#0f172a]">Mã giảm giá</h3>
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
        placeholder="Nhập mã giảm giá"
        className="min-w-0 flex-1 rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#fcd34d]"
      />
      <button
        type="button"
        onClick={onApply}
        disabled={!code.trim()}
        className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-6 py-3 font-medium text-white transition-colors hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-50">
        {applied ? (
          <>
            <Check className="h-5 w-5" />
            <span className="hidden sm:inline">Đã áp dụng</span>
          </>
        ) : (
          <span>Áp dụng</span>
        )}
      </button>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      <span className="text-sm text-[#64748b]">Mã khuyến mãi:</span>
      {["BOOK15", "FREESHIP", "NEWUSER"].map((suggestedCode) => (
        <button
          key={suggestedCode}
          type="button"
          onClick={() => onCodeChange(suggestedCode)}
          className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-sm transition-colors hover:border-[#fcd34d]">
          {suggestedCode}
        </button>
      ))}
    </div>
  </div>
);

interface OrderSummarySectionProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

const OrderSummarySection = ({
  subtotal,
  shipping,
  discount,
  total,
  itemCount,
  onCheckout,
}: OrderSummarySectionProps) => (
  <div className="sticky top-24 rounded-2xl border border-[#e2e8f0] bg-white p-6">
    <div className="mb-6 flex items-center gap-2">
      <Receipt className="h-5 w-5 text-[#fcd34d]" />
      <h3 className="text-lg font-bold text-[#0f172a]">Tóm tắt đơn hàng</h3>
    </div>

    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#64748b]">
          <ShoppingBag className="h-4 w-4" />
          <span>Tạm tính ({itemCount} sản phẩm)</span>
        </div>
        <span className="font-medium text-[#0f172a]">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#64748b]">
          <Truck className="h-4 w-4" />
          <span>Phí vận chuyển</span>
        </div>
        <span className="font-medium text-[#0f172a]">
          {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#64748b]">
            <Tag className="h-4 w-4" />
            <span>Giảm giá</span>
          </div>
          <span className="font-medium text-[#dc2626]">
            -{formatPrice(discount)}
          </span>
        </div>
      )}
    </div>

    <div className="mb-6 border-t border-[#e2e8f0] pt-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-bold text-[#0f172a]">Tổng cộng</span>
        <span className="text-2xl font-bold text-[#0f172a]">
          {formatPrice(total)}
        </span>
      </div>
      {discount > 0 && (
        <p className="mt-2 text-sm text-[#10b981]">
          Bạn đã tiết kiệm {formatPrice(discount)}
        </p>
      )}
    </div>

    <div className="space-y-3">
      <button
        type="button"
        onClick={onCheckout}
        className="w-full rounded-full bg-[#0f172a] py-4 text-lg font-bold text-white transition-colors hover:bg-[#334155]">
        Tiến hành thanh toán
      </button>
      <p className="text-center text-sm text-[#64748b]">
        Miễn phí vận chuyển cho đơn từ 150.000₫
      </p>
    </div>
  </div>
);

export default CartPage;
