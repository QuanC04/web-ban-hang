import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Clock,
  Heart,
  Home,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../store/cart";
import { addToCart } from "../api/cart";
import { getMarketProduct, getProductById } from "../api/product";

interface ProductDetailPageProps {
  productId: string;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
];

const vouchers = [
  {
    code: "BOOK15",
    discount: "Giảm 15%",
    description: "Giảm tối đa 50.000đ",
    minOrder: 200000,
  },
  {
    code: "FREESHIP",
    discount: "Miễn phí vận chuyển",
    description: "Cho đơn từ 150.000đ",
    minOrder: 150000,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 850, percentage: 68 },
  { stars: 4, count: 280, percentage: 22 },
  { stars: 3, count: 75, percentage: 6 },
  { stars: 2, count: 30, percentage: 3 },
  { stars: 1, count: 15, percentage: 1 },
];

const reviews = [
  {
    userName: "Nguyễn Thị Mai",
    rating: 5,
    date: "15/04/2026",
    comment:
      "Sách được đóng gói cẩn thận, bìa đẹp và nội dung đúng như mô tả. Shop phản hồi nhanh.",
    variant: "Bìa mềm - Tiếng Việt",
    helpful: 24,
  },
  {
    userName: "Trần Văn Hùng",
    rating: 4,
    date: "10/04/2026",
    comment:
      "Giao hàng đúng hẹn, chất lượng in tốt. Giá hợp lý so với mặt bằng chung.",
    variant: "Tiêu chuẩn",
    helpful: 12,
  },
  {
    userName: "Lê Thị Hương",
    rating: 5,
    date: "05/04/2026",
    comment:
      "Một trải nghiệm mua sách rất ổn. Mình sẽ quay lại shop cho các đầu sách tiếp theo.",
    variant: "Tiếng Việt",
    helpful: 18,
  },
];

const relatedBooks = [
  {
    id: "related-1",
    title: "Sapiens: Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    price: 189000,
    originalPrice: 220000,
    rating: 4.9,
    sold: 2100,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    shop: "Nhà sách Tri Thức",
  },
  {
    id: "related-2",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    price: 65000,
    originalPrice: 85000,
    rating: 4.7,
    sold: 3500,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    shop: "Nhà sách Phương Nam",
  },
  {
    id: "related-3",
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    author: "Rosie Nguyễn",
    price: 85000,
    rating: 4.6,
    sold: 1800,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    shop: "Nhà sách Kim Đồng",
  },
  {
    id: "related-4",
    title: "Atomic Habits",
    author: "James Clear",
    price: 119000,
    originalPrice: 149000,
    rating: 4.8,
    sold: 2800,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    shop: "Nhà sách Văn Học",
  },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const navigate = useNavigate();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const setCheckoutCartItemsIds = useCartStore(
    (state) => state.setCheckoutCartItemsIds,
  );
  const [product, setProduct] = useState<Awaited<
    ReturnType<typeof getProductById>
  > | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState("standard");
  const [selectedLanguage, setSelectedLanguage] = useState("vietnamese");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getMarketProduct(productId);
        if (!product) setNotice("Không tìm thấy sản phẩm.");
        setProduct(product);
      } catch {
        setNotice("Không thể tải thông tin sản phẩm.");
        setProduct(null);
      }
    };
    fetchProduct();
  }, [productId]);

  const images = useMemo(() => {
    if (!product?.image_url) return fallbackImages;
    return [product.image_url, ...fallbackImages.filter((image) => image !== product.image_url)].slice(0, 4);
  }, [product?.image_url]);

  if (!product) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-16">
        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center">
          <p className="text-2xl font-bold text-[#0f172a]">
            {notice || "Không tìm thấy sản phẩm."}
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="mt-6 rounded-full bg-[#0f172a] px-8 py-3 text-white transition hover:bg-[#334155]">
            Quay về trang chủ
          </button>
        </div>
      </main>
    );
  }

  const shopName = product.user?.full_name || "Bookora Shop";
  const categoryName = product.category?.name || "Bookora";
  const stockQuantity = product.stock_quantity ?? 0;
  const isAvailable = product.status === "active" && stockQuantity > 0;
  const originalPrice = Math.round(product.base_price * 1.25);
  const discount = Math.round(
    ((originalPrice - product.base_price) / originalPrice) * 100,
  );

  const handleAddToCart = async () => {
    if (!isAvailable) return;

    try {
      setIsSubmitting(true);
      setNotice("");
      await addToCart(product.id, quantity);
      await fetchCart();
      setNotice(`Đã thêm ${quantity} sản phẩm vào giỏ hàng.`);
    } catch {
      setNotice("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAvailable) return;

    try {
      setIsSubmitting(true);
      setNotice("");
      const response = await addToCart(product.id, quantity);
      const cartItemId = response.data?.id;
      await fetchCart();

      if (!cartItemId) {
        navigate({ to: "/cart" });
        return;
      }

      setCheckoutCartItemsIds([cartItemId]);
      navigate({ to: "/checkout" });
    } catch {
      setNotice("Không thể mua ngay sản phẩm này. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[#64748b]">
        <Link to="/" className="hover:text-[#0f172a]" aria-label="Trang chủ">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="hover:text-[#0f172a]">Sản phẩm</span>
        <ChevronRight className="h-4 w-4" />
        <span className="hover:text-[#0f172a]">{categoryName}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 font-medium text-[#0f172a]">
          {product.name}
        </span>
      </nav>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="sticky top-24">
            <div className="mb-4 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#fff7ed]">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsWishlisted((prev) => !prev)}
                  className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-[#fff7ed]"
                  aria-label="Yêu thích">
                  <Heart
                    className={`h-6 w-6 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-[#0f172a]"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border-2 bg-white transition-all ${
                    selectedImage === index
                      ? "border-[#fcd34d] ring-2 ring-[#fcd34d]/20"
                      : "border-[#e2e8f0] hover:border-[#fcd34d]"
                  }`}>
                  <div className="aspect-[3/4] overflow-hidden bg-[#fff7ed]">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <section>
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-[#64748b]">
              <Store className="h-4 w-4" />
              <span>{shopName}</span>
              <span>|</span>
              <span>{categoryName}</span>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-[#0f172a] md:text-3xl">
              {product.name}
            </h1>
            <p className="mb-4 text-lg text-[#64748b]">
              {product.description ? "Bookora Selection" : "Thông tin sách"}
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-[#e2e8f0] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-5 w-5 fill-[#fcd34d] text-[#fcd34d]"
                    />
                  ))}
                </div>
                <span className="font-bold text-[#0f172a]">4.8</span>
              </div>
              <div className="h-4 w-px bg-[#e2e8f0]" />
              <button
                type="button"
                className="text-[#64748b] underline hover:text-[#0f172a]">
                1.250 đánh giá
              </button>
              <div className="h-4 w-px bg-[#e2e8f0]" />
              <span className="text-[#64748b]">1.250 đã bán</span>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-[#fff7ed] p-6">
            <div className="mb-2 flex flex-wrap items-end gap-4">
              <span className="text-3xl font-bold text-[#0f172a] md:text-4xl">
                {formatPrice(product.base_price)}
              </span>
              <span className="mb-1 text-xl text-[#64748b] line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="rounded-full bg-[#fcd34d] px-3 py-1 text-sm font-bold text-[#0f172a]">
                -{discount}%
              </span>
            </div>
            {!isAvailable ? (
              <p className="text-sm font-medium text-[#dc2626]">
                Sản phẩm hiện không khả dụng.
              </p>
            ) : null}
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-bold text-[#0f172a]">Mã giảm giá</h3>
            <div className="space-y-2">
              {vouchers.map((voucher) => (
                <VoucherCard key={voucher.code} {...voucher} />
              ))}
            </div>
          </div>

          <div className="mb-6 space-y-6">
            <VariantSelector
              label="Phiên bản"
              variants={[
                { id: "standard", name: "Tiêu chuẩn", available: true },
                { id: "gift", name: "Bản quà tặng", available: true },
                { id: "special", name: "Đặc biệt", available: false },
              ]}
              selected={selectedEdition}
              onSelect={setSelectedEdition}
            />
            <VariantSelector
              label="Ngôn ngữ"
              variants={[
                { id: "vietnamese", name: "Tiếng Việt", available: true },
                { id: "english", name: "Tiếng Anh", available: true },
              ]}
              selected={selectedLanguage}
              onSelect={setSelectedLanguage}
            />
          </div>

          <div className="mb-6">
            <label className="mb-3 block font-medium text-[#0f172a]">
              Số lượng
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-xl border-2 border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="p-3 transition-colors hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Giảm số lượng">
                  <Minus className="h-5 w-5 text-[#0f172a]" />
                </button>
                <span className="border-x-2 border-[#e2e8f0] px-8 py-3 font-bold text-[#0f172a]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.min(stockQuantity || prev + 1, prev + 1))
                  }
                  disabled={!stockQuantity || quantity >= stockQuantity}
                  className="p-3 transition-colors hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Tăng số lượng">
                  <Plus className="h-5 w-5 text-[#0f172a]" />
                </button>
              </div>
              <span className="text-[#64748b]">
                <span className="font-medium text-[#0f172a]">{stockQuantity}</span> sản phẩm có sẵn
              </span>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable || isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#0f172a] py-4 font-bold text-[#0f172a] transition-colors hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:opacity-50">
              <ShoppingCart className="h-5 w-5" />
              <span>{isSubmitting ? "Đang xử lý..." : "Thêm vào giỏ"}</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!isAvailable || isSubmitting}
              className="flex flex-1 items-center justify-center rounded-full bg-[#0f172a] py-4 font-bold text-white transition-colors hover:bg-[#334155] disabled:cursor-not-allowed disabled:bg-[#64748b]">
              Mua ngay
            </button>
            <button
              type="button"
              className="rounded-full border-2 border-[#e2e8f0] px-6 py-4 transition-colors hover:bg-[#fff7ed]"
              aria-label="Chia sẻ">
              <Share2 className="h-5 w-5 text-[#0f172a]" />
            </button>
          </div>

          {notice ? (
            <p className="mb-6 rounded-xl border border-[#e2e8f0] bg-white p-4 text-sm font-medium text-[#0f172a]">
              {notice}
            </p>
          ) : null}

          <div className="mb-6 grid grid-cols-2 gap-3">
            <TrustBadge
              icon={Shield}
              title="100% chính hãng"
              description="Đảm bảo nguồn gốc"
            />
            <TrustBadge
              icon={RotateCcw}
              title="Đổi trả 7 ngày"
              description="Miễn phí đổi trả"
            />
          </div>

          <ShippingInfoCard />
        </section>
      </div>

      <section className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fcd34d]">
              <span className="text-2xl font-bold text-[#0f172a]">
                {shopName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="mb-1 text-lg font-bold text-[#0f172a]">
                {shopName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#64748b]">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#fcd34d] text-[#fcd34d]" />
                  4.8 (1.250 đánh giá)
                </span>
                <span className="hidden sm:inline">|</span>
                <span>156 sản phẩm</span>
                <span className="hidden sm:inline">|</span>
                <span>
                  {product.user?.addresses?.[0]?.province_name || "Không xác định"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <Link
              to="/shops/$shopId"
              params={{ shopId: product.user?.id ?? "my-shop" }}
              className="flex-1 rounded-full border-2 border-[#0f172a] px-6 py-3 text-center font-medium text-[#0f172a] transition-colors hover:bg-[#fff7ed] md:flex-none">
              Xem shop
            </Link>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 font-medium text-white transition-colors hover:bg-[#334155] md:flex-none">
              <MessageCircle className="h-5 w-5" />
              <span>Chat ngay</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-6 md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-[#0f172a]">
          Chi tiết sản phẩm
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <ProductSpec label="Danh mục" value={categoryName} />
          <ProductSpec label="Tình trạng" value={isAvailable ? "Đang bán" : "Không khả dụng"} />
          <ProductSpec label="Kho" value={`${stockQuantity} sản phẩm`} />
          <ProductSpec label="Cửa hàng" value={shopName} />
        </div>
        <div>
          <h3 className="mb-4 font-bold text-[#0f172a]">Mô tả sản phẩm</h3>
          <div className="max-w-none text-[#475569]">
            <p className="whitespace-pre-line leading-relaxed">
              {product.description || "Sản phẩm chưa có mô tả chi tiết."}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-6 md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-[#0f172a]">
          Đánh giá sản phẩm
        </h2>
        <RatingsSummary />
        <div className="mt-8 space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={`${review.userName}-${review.date}`} {...review} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="rounded-full border-2 border-[#0f172a] px-8 py-3 font-medium text-[#0f172a] transition-colors hover:bg-[#fff7ed]">
            Xem tất cả đánh giá
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-[#0f172a]">
          Sản phẩm tương tự
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {relatedBooks.map((book) => (
            <RelatedProductCard key={book.id} {...book} />
          ))}
        </div>
      </section>
    </main>
  );
};

interface VariantSelectorProps {
  label: string;
  variants: Array<{ id: string; name: string; available: boolean }>;
  selected: string;
  onSelect: (id: string) => void;
}

const VariantSelector = ({
  label,
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) => (
  <div>
    <p className="mb-3 font-medium text-[#0f172a]">{label}</p>
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => variant.available && onSelect(variant.id)}
          disabled={!variant.available}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            selected === variant.id
              ? "border-[#0f172a] bg-[#0f172a] text-white"
              : "border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#fcd34d] hover:bg-[#fff7ed]"
          }`}>
          {variant.name}
        </button>
      ))}
    </div>
  </div>
);

interface VoucherCardProps {
  code: string;
  discount: string;
  description: string;
  minOrder: number;
}

const VoucherCard = ({ code, discount, description, minOrder }: VoucherCardProps) => (
  <div className="flex items-center justify-between rounded-xl border border-[#fcd34d] bg-[#fff7ed] p-3">
    <div>
      <p className="font-bold text-[#0f172a]">{discount}</p>
      <p className="text-sm text-[#64748b]">
        {description} • Đơn từ {formatPrice(minOrder)}
      </p>
    </div>
    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#0f172a]">
      {code}
    </span>
  </div>
);

const ShippingInfoCard = () => (
  <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
    <h3 className="mb-3 font-bold text-[#0f172a]">Thông tin vận chuyển</h3>
    <div className="space-y-3">
      {[
        { type: "Giao hàng tiêu chuẩn", price: 30000, estimatedDays: "2-3 ngày", icon: Truck },
        { type: "Giao hàng nhanh", price: 50000, estimatedDays: "Trong 24 giờ", icon: Clock },
        { type: "Miễn phí vận chuyển", price: 0, estimatedDays: "3-5 ngày", icon: Award },
      ].map((option) => {
        const Icon = option.icon;
        return (
          <div key={option.type} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff7ed]">
                <Icon className="h-5 w-5 text-[#b45309]" />
              </div>
              <div>
                <p className="font-medium text-[#0f172a]">{option.type}</p>
                <p className="text-sm text-[#64748b]">{option.estimatedDays}</p>
              </div>
            </div>
            <span className="font-medium text-[#0f172a]">
              {option.price === 0 ? "Miễn phí" : formatPrice(option.price)}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

interface TrustBadgeProps {
  icon: typeof Shield;
  title: string;
  description: string;
}

const TrustBadge = ({ icon: Icon, title, description }: TrustBadgeProps) => (
  <div className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3">
    <Icon className="h-6 w-6 flex-shrink-0 text-[#fcd34d]" />
    <div>
      <p className="text-sm font-medium text-[#0f172a]">{title}</p>
      <p className="text-xs text-[#64748b]">{description}</p>
    </div>
  </div>
);

interface ProductSpecProps {
  label: string;
  value: string;
}

const ProductSpec = ({ label, value }: ProductSpecProps) => (
  <div className="flex border-b border-[#e2e8f0] py-3">
    <span className="w-1/3 text-[#64748b]">{label}:</span>
    <span className="font-medium text-[#0f172a]">{value}</span>
  </div>
);

const RatingsSummary = () => (
  <div className="grid grid-cols-1 gap-6 rounded-2xl bg-[#fff7ed] p-6 md:grid-cols-[14rem_1fr]">
    <div className="text-center md:text-left">
      <p className="text-5xl font-bold text-[#0f172a]">4.8</p>
      <div className="my-3 flex justify-center gap-1 md:justify-start">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-[#fcd34d] text-[#fcd34d]" />
        ))}
      </div>
      <p className="text-sm text-[#64748b]">1.250 đánh giá</p>
    </div>
    <div className="space-y-2">
      {ratingBreakdown.map((item) => (
        <div key={item.stars} className="flex items-center gap-3">
          <span className="w-10 text-sm text-[#64748b]">{item.stars} sao</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#fcd34d]"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <span className="w-10 text-right text-sm text-[#64748b]">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  </div>
);

interface ReviewCardProps {
  userName: string;
  rating: number;
  date: string;
  comment: string;
  variant: string;
  helpful: number;
}

const ReviewCard = ({
  userName,
  rating,
  date,
  comment,
  variant,
  helpful,
}: ReviewCardProps) => (
  <article className="border-b border-[#e2e8f0] pb-6 last:border-b-0 last:pb-0">
    <div className="mb-3 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d] font-bold text-[#0f172a]">
          {userName.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-[#0f172a]">{userName}</p>
          <p className="text-sm text-[#64748b]">{date}</p>
        </div>
      </div>
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Đã mua hàng
      </span>
    </div>
    <div className="mb-2 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "fill-[#fcd34d] text-[#fcd34d]" : "text-[#cbd5e1]"
          }`}
        />
      ))}
    </div>
    <p className="mb-2 text-sm text-[#64748b]">Phân loại: {variant}</p>
    <p className="mb-3 leading-relaxed text-[#475569]">{comment}</p>
    <button
      type="button"
      className="text-sm font-medium text-[#0f172a] hover:underline">
      Hữu ích ({helpful})
    </button>
  </article>
);

interface RelatedProductCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: number;
  image: string;
  shop: string;
}

const RelatedProductCard = ({
  title,
  author,
  price,
  originalPrice,
  rating,
  sold,
  image,
  shop,
}: RelatedProductCardProps) => (
  <article className="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white transition-all hover:shadow-lg">
    <div className="aspect-[3/4] overflow-hidden bg-[#fff7ed]">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-4">
      <p className="mb-1 line-clamp-2 min-h-[2.75rem] font-bold text-[#0f172a]">
        {title}
      </p>
      <p className="mb-2 text-sm text-[#64748b]">{author}</p>
      <div className="mb-2 flex items-center gap-1">
        <Star className="h-4 w-4 fill-[#fcd34d] text-[#fcd34d]" />
        <span className="text-sm font-medium text-[#0f172a]">{rating}</span>
        <span className="text-sm text-[#64748b]">({sold} đã bán)</span>
      </div>
      <p className="mb-2 text-xs text-[#64748b]">{shop}</p>
      <div className="flex flex-wrap items-end gap-2">
        <span className="text-lg font-bold text-[#0f172a]">
          {formatPrice(price)}
        </span>
        {originalPrice ? (
          <span className="text-sm text-[#64748b] line-through">
            {formatPrice(originalPrice)}
          </span>
        ) : null}
      </div>
    </div>
  </article>
);

export default ProductDetailPage;
