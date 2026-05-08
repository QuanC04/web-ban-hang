export interface MarketplaceUser {
  id: string;
  name: string;
  city: string;
  rating: number;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
}

export interface MarketplaceProduct {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_key: string | null;
  image_provider: string;
  base_price: number;
  stock_quantity: number;
  status: string;
  created_at: string;
  user: MarketplaceUser;
  category: MarketplaceCategory;
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "book-midnight-library",
    user_id: "shop-abc",
    category_id: "cat-tieu-thuyet",
    name: "The Midnight Library",
    description:
      "Tiểu thuyết chữa lành về lựa chọn, cơ hội thứ hai và ý nghĩa cuộc sống.",
    image_url: "from-orange-200 via-amber-100 to-yellow-50",
    image_key: "products/book-midnight-library.jpg",
    image_provider: "cloudflare_r2",
    base_price: 229000,
    stock_quantity: 24,
    status: "active",
    created_at: "2026-04-01T08:00:00.000Z",
    user: {
      id: "shop-abc",
      name: "Shop ABC",
      city: "Hà Nội",
      rating: 4.8,
    },
    category: {
      id: "cat-tieu-thuyet",
      name: "Tiểu thuyết",
    },
  },
  {
    id: "book-atomic-habits",
    user_id: "shop-zenbook",
    category_id: "cat-phat-trien-ban-than",
    name: "Atomic Habits",
    description:
      "Phương pháp xây dựng thói quen nhỏ tạo nên thay đổi lớn theo thời gian.",
    image_url: "from-emerald-200 via-teal-100 to-cyan-50",
    image_key: "products/book-atomic-habits.jpg",
    image_provider: "cloudflare_r2",
    base_price: 199000,
    stock_quantity: 30,
    status: "active",
    created_at: "2026-04-03T09:15:00.000Z",
    user: {
      id: "shop-zenbook",
      name: "ZenBook Store",
      city: "TP. Hồ Chí Minh",
      rating: 4.6,
    },
    category: {
      id: "cat-phat-trien-ban-than",
      name: "Phát triển bản thân",
    },
  },
  {
    id: "book-ikigai",
    user_id: "shop-sakura",
    category_id: "cat-phat-trien-ban-than",
    name: "Ikigai",
    description:
      "Khám phá bí quyết sống lâu và hạnh phúc từ triết lý Ikigai của người Nhật.",
    image_url: "from-pink-200 via-rose-100 to-orange-50",
    image_key: "products/book-ikigai.jpg",
    image_provider: "cloudflare_r2",
    base_price: 179000,
    stock_quantity: 18,
    status: "active",
    created_at: "2026-04-05T07:20:00.000Z",
    user: {
      id: "shop-sakura",
      name: "Sakura Bookshop",
      city: "Đà Nẵng",
      rating: 4.9,
    },
    category: {
      id: "cat-phat-trien-ban-than",
      name: "Phát triển bản thân",
    },
  },
  {
    id: "book-deep-work",
    user_id: "shop-abc",
    category_id: "cat-kinh-te",
    name: "Deep Work",
    description:
      "Chiến lược tập trung sâu giúp tăng năng suất trong thời đại nhiễu loạn.",
    image_url: "from-blue-200 via-sky-100 to-indigo-50",
    image_key: "products/book-deep-work.jpg",
    image_provider: "cloudflare_r2",
    base_price: 209000,
    stock_quantity: 16,
    status: "active",
    created_at: "2026-04-09T11:00:00.000Z",
    user: {
      id: "shop-abc",
      name: "Shop ABC",
      city: "Hà Nội",
      rating: 4.8,
    },
    category: {
      id: "cat-kinh-te",
      name: "Kinh tế",
    },
  },
  {
    id: "book-kafka-by-the-shore",
    user_id: "shop-zenbook",
    category_id: "cat-tieu-thuyet",
    name: "Kafka On The Shore",
    description:
      "Tác phẩm siêu thực hòa trộn giữa hiện thực và huyền ảo đầy ám ảnh.",
    image_url: "from-fuchsia-200 via-pink-100 to-rose-50",
    image_key: "products/book-kafka-by-the-shore.jpg",
    image_provider: "cloudflare_r2",
    base_price: 239000,
    stock_quantity: 10,
    status: "active",
    created_at: "2026-04-12T13:40:00.000Z",
    user: {
      id: "shop-zenbook",
      name: "ZenBook Store",
      city: "TP. Hồ Chí Minh",
      rating: 4.6,
    },
    category: {
      id: "cat-tieu-thuyet",
      name: "Tiểu thuyết",
    },
  },
  {
    id: "book-conan-vol-1",
    user_id: "shop-manga-hub",
    category_id: "cat-manga",
    name: "Conan Tập 1",
    description:
      "Mở đầu hành trình phá án kinh điển của thám tử nhí Conan.",
    image_url: "from-lime-200 via-green-100 to-emerald-50",
    image_key: "products/book-conan-vol-1.jpg",
    image_provider: "cloudflare_r2",
    base_price: 29000,
    stock_quantity: 45,
    status: "active",
    created_at: "2026-04-15T10:10:00.000Z",
    user: {
      id: "shop-manga-hub",
      name: "Manga Hub",
      city: "Cần Thơ",
      rating: 4.3,
    },
    category: {
      id: "cat-manga",
      name: "Manga",
    },
  },
];
