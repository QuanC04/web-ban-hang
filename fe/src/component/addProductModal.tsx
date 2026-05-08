import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { createProduct, getCategories, updateProduct } from "../api/product";
import { deleteImageByKey } from "../api/upload";
import type { CategoryItem, ProductItem, UploadFileResult } from "../models";
import { useUserStore } from "../store/user";
import { useAvatarUpload } from "../hooks/useAvatarUpload";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>; // Optional callback for successful creation/update
  productToEdit?: ProductItem | null;
}

const defaultForm = {
  category_id: "",
  name: "",
  description: "",
  image_url: "",
  image_key: "",
  base_price: "",
  stock_quantity: "0",
  status: "active",
};

const AddProductModal = ({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}: AddProductModalProps) => {
  const { user } = useUserStore();
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedTempImageKeys, setUploadedTempImageKeys] = useState<string[]>(
    [],
  );
  const initialImageRef = useRef({
    image_url: "",
    image_key: "",
  });
  const {
    isAvatarModalOpen,
    openAvatarModal,
    closeAvatarModal,
    avatarFile,
    avatarPreview,
    isUploadingAvatar,
    handleAvatarFileSelect,
    handleUploadAvatar,
  } = useAvatarUpload({
    onUploadSuccess: (uploaRes: UploadFileResult) => {
      const uploadedKey = uploaRes.key?.trim();
      setForm((prev) => ({
        ...prev,
        image_url: uploaRes.url,
        image_key: uploaRes.key,
      }));

      if (uploadedKey && uploadedKey !== initialImageRef.current.image_key) {
        setUploadedTempImageKeys((prev) =>
          prev.includes(uploadedKey) ? prev : [...prev, uploadedKey],
        );
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setError("");
        const items = await getCategories();
        setCategories(items);
        if (items.length > 0) {
          setForm((prev) => ({
            ...prev,
            category_id: prev.category_id || items[0].id,
          }));
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Không tải được danh mục.";
        setError(message);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      const editForm = {
        category_id: productToEdit.category_id || "",
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        image_url: productToEdit.image_url || "",
        image_key: productToEdit.image_key || "",
        base_price: productToEdit.base_price.toString() || "",
        stock_quantity: productToEdit.stock_quantity.toString() || "0",
        status: productToEdit.status || "active",
      };

      initialImageRef.current = {
        image_url: editForm.image_url,
        image_key: editForm.image_key,
      };
      setForm(editForm);
    } else {
      initialImageRef.current = {
        image_url: "",
        image_key: "",
      };
      setForm(defaultForm);
    }

    setUploadedTempImageKeys([]);
  }, [isOpen, productToEdit]);

  const cleanupTempUploadedImages = useCallback(
    async (keepImageKey?: string) => {
      const normalizedKeepKey = keepImageKey?.trim();
      const keysToDelete = uploadedTempImageKeys.filter(
        (key) => key && key !== normalizedKeepKey,
      );

      if (keysToDelete.length === 0) return;

      await Promise.allSettled(
        keysToDelete.map((key) => deleteImageByKey(key)),
      );
      setUploadedTempImageKeys((prev) =>
        prev.filter((key) => key === normalizedKeepKey),
      );
    },
    [uploadedTempImageKeys],
  );

  const categoryOptions = useMemo(() => {
    const categoriesByParent = new Map<string | null, CategoryItem[]>();

    categories.forEach((category) => {
      const key = category.parent_id ?? null;
      const current = categoriesByParent.get(key) || [];
      current.push(category);
      categoriesByParent.set(key, current);
    });

    const rootCategories = categoriesByParent.get(null) || [];
    const options: { id: string; label: string }[] = [];

    rootCategories.forEach((root) => {
      options.push({ id: root.id, label: root.name });
      const children = categoriesByParent.get(root.id) || [];
      children.forEach((child) => {
        options.push({ id: child.id, label: `↳ ${child.name}` });
      });
    });

    if (options.length === 0) {
      return categories.map((item) => ({ id: item.id, label: item.name }));
    }

    return options;
  }, [categories]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleClose = async () => {
    await cleanupTempUploadedImages(initialImageRef.current.image_key);
    setForm(defaultForm);
    setError("");
    setSuccess("");
    closeAvatarModal();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      setError("Không tìm thấy thông tin người bán.");
      return;
    }

    if (!form.category_id || !form.name.trim() || !form.base_price.trim()) {
      setError("Vui lòng nhập đủ danh mục, tên sản phẩm và giá.");
      return;
    }

    const basePrice = Number(form.base_price);
    const stockQuantity = Number(form.stock_quantity || 0);

    if (Number.isNaN(basePrice) || basePrice < 0) {
      setError("Giá sản phẩm phải là số hợp lệ.");
      return;
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      setError("Tồn kho phải là số không âm.");
      return;
    }

    let uploadedInSubmitKey: string | undefined;

    try {
      setIsSubmitting(true);
      setError("");
      let finalImageUrl = form.image_url;
      let finalImageKey = form.image_key;
      if (avatarFile) {
        try {
          const uploadRes = await handleUploadAvatar();
          finalImageUrl = uploadRes?.url || form.image_url;
          finalImageKey = uploadRes?.key || form.image_key;
          uploadedInSubmitKey = uploadRes?.key;
        } catch (err) {
          setError("Upload ảnh thất bại, vui lòng thử lại.");
          return;
        }
      }

      if (productToEdit) {
        // Update product logic
        await updateProduct(productToEdit.id, {
          category_id: form.category_id,
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          image_url: finalImageUrl.trim() || undefined,
          image_key: finalImageKey.trim() || undefined,
          base_price: basePrice,
          stock_quantity: stockQuantity,
          status: form.status,
        });
        setSuccess("Cập nhật sản phẩm thành công.");
      } else {
        // Create product logic
        await createProduct({
          user_id: user.id,
          category_id: form.category_id,
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          image_url: finalImageUrl.trim() || undefined,
          image_key: finalImageKey.trim(),
          base_price: basePrice,
          stock_quantity: stockQuantity,
          status: form.status,
        });
        setSuccess("Tạo sản phẩm thành công.");
      }

      await cleanupTempUploadedImages(finalImageKey);

      setForm({ ...defaultForm, category_id: form.category_id });
      await onSuccess?.();
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (productToEdit
          ? "Cập nhật sản phẩm thất bại."
          : "Tạo sản phẩm thất bại.");
      setError(message);

      if (uploadedInSubmitKey) {
        await deleteImageByKey(uploadedInSubmitKey).catch(() => undefined);
        setUploadedTempImageKeys((prev) =>
          prev.filter((key) => key !== uploadedInSubmitKey),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}></div>

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Thêm sản phẩm mới
            </h3>
            <p className="text-sm text-slate-500">
              Nhập thông tin theo model Product
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Danh mục
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                disabled={isLoadingCategories}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500">
                {isLoadingCategories ? (
                  <option value="">Đang tải danh mục...</option>
                ) : categoryOptions.length > 0 ? (
                  categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))
                ) : (
                  <option value="">Không có danh mục</option>
                )}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Tên sản phẩm
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ví dụ: Atomic Habits"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Mô tả
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn về sản phẩm"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Ảnh đại diện (image_url)
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
                  />
                  <button
                    type="button"
                    onClick={openAvatarModal}
                    className="shrink-0 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Upload ảnh
                  </button>
                </div>

                {form.image_url && (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <img
                      src={form.image_url}
                      alt="Product preview"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Giá gốc (base_price)
              </label>
              <input
                name="base_price"
                type="number"
                min={0}
                value={form.base_price}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Tồn kho (stock_quantity)
              </label>
              <input
                name="stock_quantity"
                type="number"
                min={0}
                value={form.stock_quantity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500">
                <option value="active">active</option>
                <option value="draft">draft</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              {success}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Hủy
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                isUploadingAvatar ||
                isLoadingCategories ||
                categoryOptions.length === 0
              }
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              Lưu sản phẩm
            </button>
          </div>
        </form>
      </div>

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-slate-900">
              Upload ảnh sản phẩm
            </h4>
            <p className="mt-1 text-sm text-slate-500">JPG, PNG - tối đa 2MB</p>

            <label
              className="mt-4 block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-slate-500"
              onDrop={(e) => {
                e.preventDefault();
                handleAvatarFileSelect(e.dataTransfer.files?.[0]);
              }}
              onDragOver={(e) => e.preventDefault()}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => handleAvatarFileSelect(e.target.files?.[0])}
              />
              <p className="text-sm text-slate-700">
                Kéo và thả ảnh vào đây hoặc bấm để chọn ảnh
              </p>
            </label>

            {avatarPreview && (
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={avatarPreview}
                  alt="Selected upload"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <p className="text-sm text-slate-600">{avatarFile?.name}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAvatarModal}
                disabled={isUploadingAvatar}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Hủy
              </button>
              <button
                type="button"
                onClick={handleUploadAvatar}
                disabled={!avatarFile || isUploadingAvatar}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {isUploadingAvatar && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {isUploadingAvatar ? "Đang upload..." : "Lưu ảnh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductModal;
