import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  Headphones,
  Heart,
  Package,
  RotateCcw,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { getMarketProducts } from "../api/product";
import type { HomeProductItem } from "../models";
import { useSearchStore } from "../store/search";
import { useCartStore } from "../store/cart";
import { addToCart } from "../api/cart";

const categories = [
  { name: "Văn học", icon: BookOpen, count: 2500 },
  { name: "Kinh tế", icon: TrendingUp, count: 1800 },
  { name: "Kỹ năng", icon: Award, count: 1200 },
  { name: "Thiếu nhi", icon: Heart, count: 980 },
  { name: "Tâm lý", icon: Sparkles, count: 750 },
  { name: "Lịch sử", icon: BookOpen, count: 650 },
];

const benefits = [
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Miễn phí vận chuyển đơn từ 150.000đ",
  },
  {
    icon: Shield,
    title: "Thanh toán an toàn",
    description: "Bảo mật thông tin 100%",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả dễ dàng",
    description: "Trong vòng 7 ngày",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Luôn sẵn sàng tư vấn",
  },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const FlashSaleTimer = () => {
  const [time, setTime] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds -= 1;
        else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-[#0f172a]" />
      <div className="flex items-center gap-2">
        {[time.hours, time.minutes, time.seconds].map((value, index) => (
          <div key={index} className="contents">
            {index > 0 && <span className="font-bold text-[#0f172a]">:</span>}
            <div className="min-w-[40px] rounded-lg bg-[#0f172a] px-2 py-1 text-center font-bold text-white">
              {String(value).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryChip = ({
  name,
  icon: Icon,
}: {
  name: string;
  icon: typeof BookOpen;
}) => (
  <a
    href="#featured"
    className="group flex flex-col items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 transition-all hover:border-[#fcd34d] hover:shadow-md">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff7ed] transition-colors group-hover:bg-[#fcd34d]">
      <Icon className="h-7 w-7 text-[#0f172a]" />
    </div>
    <span className="text-center text-sm font-medium text-[#0f172a]">
      {name}
    </span>
  </a>
);

const ProductCard = ({
  product,
  showDiscount,
  isAdding,
  onAddToCart,
}: {
  product: HomeProductItem;
  showDiscount?: boolean;
  isAdding?: boolean;
  onAddToCart: (productId: string, quantity: number) => Promise<void> | void;
}) => {
  const originalPrice = Math.round(product.base_price * 1.25);
  const discount = Math.round(
    ((originalPrice - product.base_price) / originalPrice) * 100,
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white transition-all hover:shadow-lg">
      <Link to="/products/$productId" params={{ productId: product.id }}>
        <div className="aspect-[3/4] overflow-hidden bg-[#fff7ed]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#64748b]">
              Chưa có ảnh
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="mb-1 line-clamp-2 block min-h-[3rem] font-bold text-[#0f172a] transition hover:text-[#334155]">
          {product.name}
        </Link>
        <p className="mb-3 text-sm text-[#64748b]">
          {product.user.full_name || "Bookora Shop"}
        </p>
        <div className="mb-3 flex items-center gap-1">
          <Star className="h-4 w-4 fill-[#fcd34d] text-[#fcd34d]" />
          <span className="text-sm font-medium text-[#0f172a]">4.8</span>
          <span className="text-sm text-[#64748b]">(120 đã bán)</span>
        </div>
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <span className="text-xl font-bold text-[#0f172a]">
            {formatPrice(product.base_price)}
          </span>
          {showDiscount && (
            <>
              <span className="text-sm text-[#64748b] line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="rounded-full bg-[#fcd34d] px-2 py-1 text-xs font-bold text-[#0f172a]">
                -{discount}%
              </span>
            </>
          )}
        </div>
        <p className="mb-3 text-sm text-[#64748b]">
          {product.user.full_name || "Bookora Shop"}
        </p>
        <button
          type="button"
          disabled={isAdding}
          onClick={() => onAddToCart(product.id, 1)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0f172a] py-3 text-white transition-colors hover:bg-[#334155] disabled:cursor-not-allowed disabled:bg-[#64748b]">
          <ShoppingCart className="h-5 w-5" />
          <span>{isAdding ? "Đang thêm..." : "Thêm vào giỏ"}</span>
        </button>
      </div>
    </article>
  );
};

const ShopCard = ({
  name,
  coverImage,
  productCount,
  followers,
}: {
  name: string;
  coverImage?: string | null;
  productCount: number;
  followers: number;
}) => (
  <div className="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white transition-all hover:shadow-lg">
    <div className="h-32 overflow-hidden bg-gradient-to-br from-[#fcd34d] to-[#fde68a]">
      {coverImage ? (
        <img
          src={coverImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
    </div>
    <div className="-mt-8 p-4 pt-0">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-md">
        <span className="text-xl font-bold text-[#0f172a]">
          {name.charAt(0)}
        </span>
      </div>
      <h3 className="mb-2 line-clamp-1 font-bold text-[#0f172a]">{name}</h3>
      <div className="mb-2 flex items-center gap-1">
        <Star className="h-4 w-4 fill-[#fcd34d] text-[#fcd34d]" />
        <span className="text-sm font-medium text-[#0f172a]">4.8</span>
        <span className="text-sm text-[#64748b]">
          ({followers.toLocaleString("vi-VN")} theo dõi)
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#64748b]">
        <Package className="h-4 w-4" />
        <span>{productCount} sản phẩm</span>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState<HomeProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const globalQuery = useSearchStore((state) => state.query);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getMarketProducts();
        const activeProducts = data.filter(
          (product) => product.status === "active",
        );
        if (mounted) setProducts(activeProducts);
      } catch {
        if (mounted)
          setErrorMessage("Không thể tải danh sách sản phẩm lúc này.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredproducts = useMemo(() => {
    const normalizedQuery = globalQuery.trim().toLowerCase();
    return products.filter(
      (product) =>
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.description ?? "").toLowerCase().includes(normalizedQuery),
    );
  }, [products, globalQuery]);

  const newestProducts = useMemo(() => {
    return [...filteredproducts].sort((left, right) => {
      const leftTime = new Date(left.created_at ?? 0).getTime();
      const rightTime = new Date(right.created_at ?? 0).getTime();
      return rightTime - leftTime;
    });
  }, [filteredproducts]);

  const flashSaleproducts = newestProducts.slice(0, 4);
  const featuredproducts = newestProducts.slice(4, 8).length
    ? newestProducts.slice(4, 8)
    : newestProducts.slice(0, 4);
  const trendingproducts = newestProducts.slice(8, 12).length
    ? newestProducts.slice(8, 12)
    : newestProducts.slice(0, 4);

  const recommendedShops = useMemo(() => {
    const map = new Map<
      string,
      { name: string; count: number; image?: string | null }
    >();
    products.forEach((product) => {
      const name = product.user.full_name || "Bookora Shop";
      const current = map.get(name);
      map.set(name, {
        name,
        count: (current?.count ?? 0) + 1,
        image: current?.image || product.image_url,
      });
    });
    return Array.from(map.values()).slice(0, 4);
  }, [products]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      setAddingProductId(productId);
      setCartMessage(null);
      await addToCart(productId, quantity);
      await fetchCart();
      setCartMessage("Đã thêm sản phẩm vào giỏ hàng.");
    } catch {
      setCartMessage(
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng đăng nhập hoặc thử lại.",
      );
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <main>
      <section className="bg-gradient-to-br from-[#fff7ed] via-white to-[#fef3c7] py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="order-2 md:order-1">
              <div className="mb-4 inline-block rounded-full bg-[#fcd34d] px-4 py-2">
                <span className="text-sm font-bold text-[#0f172a]">
                  KHUYẾN MÃI ĐẶC BIỆT
                </span>
              </div>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-[#0f172a] md:text-5xl">
                Tri thức là kho báu vô giá
              </h1>
              <p className="mb-6 text-base leading-relaxed text-[#475569] md:text-lg">
                Giảm đến 50% cho hàng ngàn đầu sách bestseller. Nâng cao kiến
                thức, thay đổi cuộc sống.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#featured"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-white transition-colors hover:bg-[#334155] md:px-8 md:py-4">
                  Mua ngay
                  <ChevronRight className="h-5 w-5" />
                </a>
                <a
                  href="#collections"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0f172a] px-6 py-3 text-[#0f172a] transition-colors hover:bg-[#fff7ed] md:px-8 md:py-4">
                  Khám phá thêm
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#fcd34d] opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[#fde68a] opacity-20 blur-3xl"></div>
                <img
                  src={
                    newestProducts[0]?.image_url ||
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop"
                  }
                  alt="Hero"
                  className="relative w-full rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-[#0f172a] md:mb-8 md:text-3xl">
            Danh mục nổi bật
          </h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
            {categories.map((category) => (
              <CategoryChip
                key={category.name}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#fef3c7] to-[#fff7ed] py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fcd34d]">
                <Zap className="h-6 w-6 text-[#0f172a]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0f172a] md:text-3xl">
                  Flash Sale
                </h2>
                <p className="text-sm text-[#64748b]">Kết thúc sau:</p>
              </div>
            </div>
            <FlashSaleTimer />
          </div>

          {cartMessage && (
            <div className="mb-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 text-sm font-medium text-[#0f172a]">
              {cartMessage}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center text-[#64748b]">
              Đang tải sản phẩm...
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
              {errorMessage}
            </div>
          ) : (
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {flashSaleproducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDiscount
                  isAdding={addingProductId === product.id}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
          <div className="text-center">
            <a
              href="#featured"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-white transition-colors hover:bg-[#334155]">
              Xem tất cả
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <section id="featured" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h2 className="text-2xl font-bold text-[#0f172a] md:text-3xl">
              Sách nổi bật
            </h2>
            <a
              href="#featured"
              className="flex items-center gap-2 text-[#0f172a] transition-colors hover:text-[#334155]">
              <span className="hidden sm:inline">Xem tất cả</span>
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featuredproducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdding={addingProductId === product.id}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] to-[#334155] p-8 text-white md:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#fcd34d] opacity-10 blur-3xl"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="mb-4 text-2xl font-bold md:text-4xl">
                Đăng ký thành viên VIP
              </h2>
              <p className="mb-6 text-base text-gray-300 md:text-lg">
                Nhận ưu đãi độc quyền, miễn phí vận chuyển và tích điểm đổi quà
                hấp dẫn
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#fcd34d] px-6 py-3 font-bold text-[#0f172a] transition-colors hover:bg-[#fde68a] md:px-8 md:py-4">
                Đăng ký ngay
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fcd34d]">
                <TrendingUp className="h-6 w-6 text-[#0f172a]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] md:text-3xl">
                Xu hướng
              </h2>
            </div>
            <a
              href="#featured"
              className="flex items-center gap-2 text-[#0f172a] transition-colors hover:text-[#334155]">
              <span className="hidden sm:inline">Xem tất cả</span>
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {trendingproducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdding={addingProductId === product.id}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h2 className="text-2xl font-bold text-[#0f172a] md:text-3xl">
              Cửa hàng đề xuất
            </h2>
            <a
              href="#featured"
              className="flex items-center gap-2 text-[#0f172a] transition-colors hover:text-[#334155]">
              <span className="hidden sm:inline">Xem tất cả</span>
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {recommendedShops.map((shop) => (
              <ShopCard
                key={shop.name}
                name={shop.name}
                coverImage={shop.image}
                productCount={shop.count}
                followers={3200 + shop.count * 120}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#fff7ed] to-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#0f172a] md:mb-12 md:text-3xl">
            Tại sao chọn Bookora?
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center transition-all hover:shadow-lg">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fcd34d]">
                    <Icon className="h-8 w-8 text-[#0f172a]" />
                  </div>
                  <h3 className="mb-2 font-bold text-[#0f172a]">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#64748b]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
