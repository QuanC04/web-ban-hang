import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Download,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Package,
  PackageX,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  deleteProduct,
  getProductById,
  getProductsByUserId,
} from "../api/product";
import type { ProductItem } from "../models";
import { useUserStore } from "../store/user";
import AddProductModal from "../component/addProductModal";
import SellerWorkspaceLayout from "../component/sellerWorkspaceLayout";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const PRODUCTS_PER_PAGE = 5;

const getProductStatusLabel = (product: ProductItem) => {
  if (product.status === "active" && product.stock_quantity > 0)
    return "Đang bán";
  if (product.stock_quantity === 0) return "Hết hàng";
  return "Đang ẩn";
};

const ShopProductsPage = () => {
  const { user } = useUserStore();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = useCallback(async () => {
    if (!user?.id) {
      setProducts([]);
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const items = await getProductsByUserId();
      setProducts(items);
    } catch (err) {
      setError(
        getErrorMessage(err, "Không thể tải danh sách sản phẩm của shop."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setProducts([]);
      return;
    }

    loadProducts();
  }, [loadProducts, user?.id]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.description ?? "").toLowerCase().includes(normalizedQuery) ||
        (product.category?.name ?? "").toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.status === "active") ||
        (statusFilter === "inactive" && product.status !== "active");
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && product.stock_quantity >= 20) ||
        (stockFilter === "low" &&
          product.stock_quantity > 0 &&
          product.stock_quantity < 20) ||
        (stockFilter === "out" && product.stock_quantity === 0);

      return matchesQuery && matchesStatus && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name, "vi");
      if (sortBy === "name-desc") return b.name.localeCompare(a.name, "vi");
      if (sortBy === "price-asc") return a.base_price - b.base_price;
      if (sortBy === "price-desc") return b.base_price - a.base_price;
      if (sortBy === "sold-desc") {
        return (b.sold_quantity || 0) - (a.sold_quantity || 0);
      }
      if (sortBy === "stock-asc") return a.stock_quantity - b.stock_quantity;
      return 0;
    });
  }, [products, query, sortBy, statusFilter, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const currentPageProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  const firstVisibleProductNumber = filteredProducts.length
    ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1
    : 0;
  const lastVisibleProductNumber = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );
  const visiblePageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter(
    (page) =>
      page === currentPage ||
      page === currentPage - 1 ||
      page === currentPage + 1,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortBy, statusFilter, stockFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const lowStockCount = products.filter(
    (product) => product.stock_quantity > 0 && product.stock_quantity < 20,
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.stock_quantity === 0,
  ).length;
  const healthyStockCount = products.filter(
    (product) => product.stock_quantity >= 20,
  ).length;
  const selectedVisibleProducts = selectedProducts.filter((id) =>
    currentPageProducts.some((product) => product.id === id),
  );
  const allVisibleSelected =
    currentPageProducts.length > 0 &&
    selectedVisibleProducts.length === currentPageProducts.length;

  const handleSelectAll = () => {
    const visibleIds = currentPageProducts.map((product) => product.id);
    setSelectedProducts((prev) =>
      allVisibleSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : [...prev, ...visibleIds.filter((id) => !prev.includes(id))],
    );
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id],
    );
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
    );

    if (!isConfirmed) return;

    try {
      setDeletingProductId(product.id);
      setError("");
      await deleteProduct(product.id);
      setSelectedProducts((prev) => prev.filter((id) => id !== product.id));
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Xóa sản phẩm thất bại."));
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    if (!selectedProducts.length) return;

    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`,
    );

    if (!isConfirmed) return;

    try {
      setIsDeletingSelected(true);
      setError("");
      await Promise.all(
        selectedProducts.map((productId) => deleteProduct(productId)),
      );
      setSelectedProducts([]);
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Xóa sản phẩm đã chọn thất bại."));
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const handleEditProduct = async (product: ProductItem) => {
    setIsAddProductModalOpen(true);
    const productToEdit = await getProductById(product.id);
    setProductToEdit(productToEdit);
  };

  return (
    <SellerWorkspaceLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[#0f172a]">
            Quản lý sản phẩm
          </h1>
          <p className="text-[#64748b]">
            {products.length} sản phẩm trong kho hàng của shop
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4 py-3 font-medium text-[#0f172a] transition-colors hover:bg-[#fff7ed]">
            <Download className="h-5 w-5" />
            <span>Xuất Excel</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddProductModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 font-medium text-white transition-colors hover:bg-[#334155]">
            <Plus className="h-5 w-5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="mb-1 font-bold text-red-900">Cảnh báo tồn kho</p>
              <p className="text-sm text-red-700">
                {outOfStockCount > 0 && `${outOfStockCount} sản phẩm hết hàng`}
                {outOfStockCount > 0 && lowStockCount > 0 && " • "}
                {lowStockCount > 0 && `${lowStockCount} sản phẩm sắp hết hàng`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStockFilter("low")}
              className="text-sm font-medium text-red-900 hover:underline">
              Cập nhật ngay
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !isLoading ? (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-12">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#fff7ed]">
              <PackageX className="h-12 w-12 text-[#64748b]" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-[#0f172a]">
              Chưa có sản phẩm nào
            </h3>
            <p className="mb-6 text-[#64748b]">
              Bắt đầu bán hàng bằng cách thêm sản phẩm đầu tiên của bạn.
            </p>
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(true)}
              className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-8 py-3 text-white transition-colors hover:bg-[#334155]">
              <Plus className="h-5 w-5" />
              <span>Thêm sản phẩm đầu tiên</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm kiếm theo tên sản phẩm, danh mục, mô tả..."
                    className="w-full rounded-xl border border-[#e2e8f0] py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#fcd34d]"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-3 transition-colors hover:bg-[#fff7ed]">
                  <Filter className="h-5 w-5" />
                  <span>Bộ lọc</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#fcd34d]">
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang bán</option>
                  <option value="inactive">Đang ẩn</option>
                </select>
                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#fcd34d]">
                  <option value="all">Tất cả kho hàng</option>
                  <option value="available">Còn hàng (&gt;= 20)</option>
                  <option value="low">Sắp hết (1-19)</option>
                  <option value="out">Hết hàng (0)</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#fcd34d]">
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="sold-desc">Bán chạy nhất</option>
                  <option value="stock-asc">Tồn kho thấp nhất</option>
                </select>
              </div>

              {selectedProducts.length > 0 && (
                <div className="flex flex-col gap-3 rounded-xl border border-[#fcd34d] bg-[#fff7ed] p-4 lg:flex-row lg:items-center lg:justify-between">
                  <p className="font-medium text-[#0f172a]">
                    Đã chọn {selectedProducts.length} sản phẩm
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm transition-colors hover:bg-white">
                      <Edit className="h-4 w-4" />
                      Sửa hàng loạt
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm transition-colors hover:bg-white">
                      <EyeOff className="h-4 w-4" />
                      Ẩn sản phẩm
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelectedProducts}
                      disabled={isDeletingSelected}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-[#f1f5f9]"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
                {error}
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="rounded-xl bg-[#f1f5f9] p-4 text-sm text-[#64748b]">
                Không có sản phẩm phù hợp với bộ lọc hiện tại.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px]">
                    <thead>
                      <tr className="border-b border-[#e2e8f0]">
                        <th className="w-12 px-4 py-4 text-left font-medium text-[#64748b]">
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            onChange={handleSelectAll}
                            className="h-5 w-5 rounded border-[#e2e8f0] text-[#fcd34d] focus:ring-[#fcd34d]"
                          />
                        </th>
                        <th className="px-4 py-4 text-left font-medium text-[#64748b]">
                          Sản phẩm
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Danh mục
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Giá
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Tồn kho
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Đã bán
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Doanh thu
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Trạng thái
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-[#64748b]">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageProducts.map((product) => {
                        const isActive = product.status === "active";
                        const isDeleting = deletingProductId === product.id;
                        const soldQuantity = product.sold_quantity || 0;
                        return (
                          <tr
                            key={product.id}
                            className="border-b border-[#e2e8f0] transition-colors hover:bg-[#fff7ed]">
                            <td className="px-4 py-4 align-middle">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="h-5 w-5 rounded border-[#e2e8f0] text-[#fcd34d] focus:ring-[#fcd34d]"
                              />
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#fff7ed]">
                                  {product.image_url ? (
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : null}
                                </div>
                                <div className="min-w-0">
                                  <p className="line-clamp-2 font-bold text-[#0f172a]">
                                    {product.name}
                                  </p>
                                  <p className="line-clamp-1 text-sm text-[#64748b]">
                                    {product.description || "Chưa có mô tả"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <span className="inline-block max-w-[120px] truncate rounded-full bg-[#fff7ed] px-3 py-1 text-sm text-[#0f172a]">
                                {product.category?.name || "Chưa phân loại"}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <p className="whitespace-nowrap font-bold text-[#0f172a]">
                                {formatPrice(product.base_price)}
                              </p>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <p
                                className={`font-medium ${
                                  product.stock_quantity === 0
                                    ? "text-[#dc2626]"
                                    : product.stock_quantity < 10
                                      ? "text-[#f59e0b]"
                                      : "text-[#0f172a]"
                                }`}>
                                {product.stock_quantity}
                              </p>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <p className="font-medium text-[#0f172a]">
                                {soldQuantity}
                              </p>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <p className="whitespace-nowrap font-bold text-green-700">
                                {formatPrice(product.base_price * soldQuantity)}
                              </p>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <span
                                className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${
                                  isActive && product.stock_quantity > 0
                                    ? "bg-green-100 text-green-700"
                                    : product.stock_quantity === 0
                                      ? "bg-red-100 text-red-700"
                                      : "bg-[#f1f5f9] text-[#64748b]"
                                }`}>
                                {getProductStatusLabel(product)}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <Link
                                  to="/products/$productId"
                                  params={{ productId: product.id }}
                                  className="rounded-lg p-2 transition-colors hover:bg-[#f1f5f9]"
                                  title="Xem">
                                  <Eye className="h-5 w-5 text-[#64748b]" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleEditProduct(product)}
                                  className="rounded-lg p-2 transition-colors hover:bg-[#f1f5f9]"
                                  title="Sửa">
                                  <Edit className="h-5 w-5 text-[#64748b]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(product)}
                                  disabled={isDeleting}
                                  className="rounded-lg p-2 transition-colors hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Xóa">
                                  <Trash2 className="h-5 w-5 text-[#64748b]" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[#64748b]">
                    Hiển thị {firstVisibleProductNumber}-
                    {lastVisibleProductNumber} trong {filteredProducts.length}{" "}
                    sản phẩm
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => page - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-[#e2e8f0] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">
                      Trước
                    </button>
                    {visiblePageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 transition-colors ${
                          page === currentPage
                            ? "bg-[#fff7ed] font-bold text-[#0f172a]"
                            : "text-[#64748b] hover:bg-[#f8fafc]"
                        }`}>
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => page + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-[#e2e8f0] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">
                      Sau
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <InventoryStatCard
              icon={Package}
              iconClassName="bg-green-100 text-green-600"
              value={healthyStockCount}
              label="Còn hàng đầy đủ"
            />
            <InventoryStatCard
              icon={AlertTriangle}
              iconClassName="bg-amber-100 text-amber-600"
              value={lowStockCount}
              label="Sắp hết hàng"
            />
            <InventoryStatCard
              icon={Package}
              iconClassName="bg-red-100 text-red-600"
              value={outOfStockCount}
              label="Hết hàng"
            />
          </div>
        </>
      )}

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          setIsAddProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={loadProducts}
        productToEdit={productToEdit}
      />
    </SellerWorkspaceLayout>
  );
};

interface InventoryStatCardProps {
  icon: typeof Package;
  iconClassName: string;
  value: number;
  label: string;
}

const InventoryStatCard = ({
  icon: Icon,
  iconClassName,
  value,
  label,
}: InventoryStatCardProps) => (
  <article className="rounded-xl border border-[#e2e8f0] bg-white p-6">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconClassName}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
        <p className="text-sm text-[#64748b]">{label}</p>
      </div>
    </div>
  </article>
);

export default ShopProductsPage;
