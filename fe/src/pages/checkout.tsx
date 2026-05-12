import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, MapPin, Plus, Truck } from "lucide-react";
import { useCartStore } from "../store/cart";
import { getAddressByUserId } from "../api/address";
import type { AddressItem } from "../models";
import AddAddressModal from "../component/addAddressModal";
import { createOrder } from "../api/order";
import { validateCoupon } from "../api/coupon";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkoutCartItemsIds = useCartStore(
    (state) => state.checkoutCartItemsIds,
  );
  const checkoutCouponCode = useCartStore((state) => state.checkoutCouponCode);
  const cartItems = useCartStore((state) => state.cartItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearcheckoutCartItemsIds = useCartStore(
    (state) => state.clearCheckoutCartItemsIds,
  );
  const [receiverName, setReceiverName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("09xxxxxxxx");
  const [address, setAddress] = useState("123 Đường ABC, Quận 1, TP.HCM");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [savedAddresses, setSavedAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);

  const rows = useMemo(() => {
    const selectedProductIds =
      checkoutCartItemsIds ?? cartItems.map((item) => item.id);

    return cartItems.filter((item) => selectedProductIds.includes(item.id));
  }, [checkoutCartItemsIds, cartItems]);

  const subtotal = rows.reduce(
    (sum, row) => sum + row.product.base_price * row.quantity,
    0,
  );

  const shippingFee = rows.length ? 22000 : 0;
  const total = subtotal + shippingFee - discount;

  const loadAddresses = async () => {
    try {
      const data = await getAddressByUserId();
      setSavedAddresses(data);
      const defaultAddress = data.find((item) => item.isdefault) ?? data[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setReceiverName(defaultAddress.name);
        setPhone(defaultAddress.phone_number);
        setAddress(
          [
            defaultAddress.street,
            defaultAddress.district,
            defaultAddress.province_name,
          ]
            .filter(Boolean)
            .join(", "),
        );
      }
    } catch {
      setSavedAddresses([]);
    }
  };

  const validatCoupon = async () => {
    if (!checkoutCouponCode) return;
    const result = await validateCoupon(checkoutCouponCode, subtotal);
    if (result.success) {
      setDiscount(result.data.discountAmount);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadAddresses);
    const fetchCartData = async () => {
      await fetchCart();
    };
    fetchCartData();
    validatCoupon();
  }, [fetchCart]);

  const handleSelectAddress = (addressItem: AddressItem) => {
    setSelectedAddressId(addressItem.id);
    setReceiverName(addressItem.name);
    setPhone(addressItem.phone_number);
    setAddress(
      [addressItem.street, addressItem.district, addressItem.province_name]
        .filter(Boolean)
        .join(", "),
    );
  };

  const handlePlaceOrder = async () => {
    if (!rows.length) return;
    await createOrder({
      cartItemsIds: rows.map((item) => item.id),
      shipping_address: {
        name: receiverName,
        phone_number: phone,
        address: address,
      },
      coupon_code: checkoutCouponCode,
    });
    clearcheckoutCartItemsIds();
    navigate({ to: "/order-success" });
    await fetchCart();
  };

  if (!rows.length) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center">
          <p className="text-2xl font-bold text-[#0f172a]">
            Không có sản phẩm để thanh toán.
          </p>
          <Link
            to="/cart"
            className="mt-6 inline-flex rounded-full bg-[#0f172a] px-8 py-3 text-white transition hover:bg-[#334155]">
            Quay lại giỏ hàng
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-[#0f172a]">Thanh toán</h1>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d]">
                <MapPin className="h-5 w-5 text-[#0f172a]" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">
                Địa chỉ giao hàng
              </h2>
            </div>

            <div className="space-y-4">
              {savedAddresses.length > 0 && (
                <div className="grid gap-3">
                  {savedAddresses.map((item) => {
                    const isSelected = selectedAddressId === item.id;
                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                          isSelected
                            ? "border-[#fcd34d] bg-[#fff7ed]"
                            : "border-[#e2e8f0] bg-white hover:border-[#fcd34d]"
                        }`}>
                        <input
                          type="radio"
                          name="saved-address"
                          checked={isSelected}
                          onChange={() => handleSelectAddress(item)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#0f172a]">
                              {item.name}
                            </span>
                            <span className="text-[#64748b]">|</span>
                            <span className="text-sm text-[#64748b]">
                              {item.phone_number}
                            </span>
                            {item.isdefault && (
                              <span className="rounded-full bg-[#fcd34d] px-3 py-1 text-xs font-medium text-[#0f172a]">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#64748b]">
                            {[item.street, item.district, item.province_name]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#fff7ed]">
                <Plus className="h-4 w-4" />
                Thêm địa chỉ mới
              </button>

              <div className="rounded-xl border-2 border-[#fcd34d] bg-[#fff7ed] p-4">
                <p className="mb-4 text-sm font-bold text-[#0f172a]">
                  Thông tin giao đến
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#0f172a]">
                    Người nhận
                    <input
                      value={receiverName}
                      onChange={(event) => setReceiverName(event.target.value)}
                      className="mt-2 block w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#fcd34d]"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#0f172a]">
                    Số điện thoại
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="mt-2 block w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#fcd34d]"
                    />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-[#0f172a]">
                  Địa chỉ nhận hàng
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#fcd34d]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d]">
                <Truck className="h-5 w-5 text-[#0f172a]" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">
                Phương thức vận chuyển
              </h2>
            </div>
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-[#fcd34d] bg-[#fff7ed] p-4">
              <input type="radio" name="shipping" defaultChecked />
              <div className="flex-1">
                <p className="font-bold text-[#0f172a]">Giao hàng tiêu chuẩn</p>
                <p className="text-sm text-[#64748b]">
                  Nhận hàng trong 2-3 ngày
                </p>
              </div>
              <span className="font-bold text-[#0f172a]">
                {formatPrice(shippingFee)}
              </span>
            </label>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d]">
                <CreditCard className="h-5 w-5 text-[#0f172a]" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">
                Phương thức thanh toán
              </h2>
            </div>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-[#fcd34d] bg-[#fff7ed] p-4">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <div className="flex-1">
                  <p className="font-bold text-[#0f172a]">
                    Thanh toán khi nhận hàng (COD)
                  </p>
                  <p className="text-sm text-[#64748b]">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#e2e8f0] p-4 hover:border-[#fcd34d]">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <div className="flex-1">
                  <p className="font-bold text-[#0f172a]">
                    Chuyển khoản ngân hàng
                  </p>
                  <p className="text-sm text-[#64748b]">
                    Chuyển khoản qua ví điện tử hoặc ngân hàng
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <h3 className="mb-4 font-bold text-[#0f172a]">Đơn hàng</h3>
            <div className="mb-6 space-y-4">
              {rows.map((row) => (
                <div key={row.product.id} className="flex gap-3">
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#fff7ed]">
                    {row.product.image_url ? (
                      <img
                        src={row.product.image_url}
                        alt={row.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 line-clamp-2 text-sm font-medium text-[#0f172a]">
                      {row.product.name}
                    </p>
                    <p className="text-sm text-[#64748b]">x{row.quantity}</p>
                    <p className="text-sm font-bold text-[#0f172a]">
                      {formatPrice(row.product.base_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-6 space-y-3 border-t border-[#e2e8f0] pt-6">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Tạm tính</span>
                <span className="text-[#0f172a]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Phí vận chuyển</span>
                <span className="text-[#0f172a]">
                  {formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#e2e8f0] pt-3">
                <span className="font-bold text-[#0f172a]">Tổng cộng</span>
                <span className="text-xl font-bold text-[#0f172a]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="block w-full rounded-full bg-[#0f172a] py-4 text-center text-white transition-colors hover:bg-[#334155]">
              Đặt hàng
            </button>
          </div>
        </aside>
      </section>

      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={loadAddresses}
      />
    </main>
  );
};

export default CheckoutPage;
