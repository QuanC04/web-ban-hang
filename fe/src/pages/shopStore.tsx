import { Link } from "@tanstack/react-router";
import { ChevronLeft, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { addToCart } from "../api/cart";
import { marketplaceProducts } from "../data/marketplace";
import { useCartStore } from "../store/cart";

interface ShopStorePageProps {
  shopId: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const ShopStorePage = ({ shopId }: ShopStorePageProps) => {
  const [query, setQuery] = useState("");
  const fetchCart = useCartStore((state) => state.fetchCart);
  const productsByShop = marketplaceProducts.filter(
    (item) => item.user.id === shopId,
  );
  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return productsByShop;
    return productsByShop.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        (product.description ?? "").toLowerCase().includes(normalized),
    );
  }, [query, productsByShop]);
  const shop = productsByShop[0]?.user;

  if (!shop) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-5 py-16">
        <div className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-lg font-bold text-rose-700">
            Không tìm thấy shop.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Quay về trang chủ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_85%_10%,#d4f1f5_0%,#f0f9ff_26%,#fff_70%)] px-5 py-8 text-slate-800 md:px-8 md:py-12">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          <ChevronLeft size={16} />
          Quay lại trang chủ
        </Link>

        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trang shop
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            {shop.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>Khu vực: {shop.city}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
              <Star size={15} className="fill-current" />{" "}
              {shop.rating.toFixed(1)} / 5
            </span>
            <span>{productsByShop.length} sản phẩm đang bán</span>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Tìm trong shop
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nhập tên sản phẩm hoặc mô tả..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
            />
          </label>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(15,23,42,0.55)]">
              <div
                className={`h-48 bg-linear-to-br ${product.image_url ?? "from-slate-200 via-slate-100 to-slate-50"} p-4`}>
                <div className="h-full rounded-2xl border border-white/70 bg-white/35" />
              </div>
              <div className="space-y-2 p-4">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-600">
                  {product.category.name}
                </p>
                <p className="text-lg font-black text-slate-900">
                  {formatPrice(product.base_price)}
                </p>
                <Link
                  to="/products/$productId"
                  params={{ productId: product.id }}
                  className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Xem chi tiết
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await addToCart(product.id, 1);
                    await fetchCart();
                  }}
                  className="ml-2 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Thêm giỏ
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ShopStorePage;
