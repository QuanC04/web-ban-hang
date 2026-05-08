import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Save } from "lucide-react";
import ProfileLayout from "../component/profileLayout";
import { useUserStore } from "../store/user";
import { updateProfile } from "../api/user";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import type { UploadFileResult } from "../models";
import { deleteImageByKey } from "../api/upload";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

const ProfilePage = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedTempImageKeys, setUploadedTempImageKeys] = useState<string[]>(
    [],
  );
  const initialImageRef = useRef({
    image_url: user?.avatar_url || "",
    image_key: user?.avatar_key ? String(user.avatar_key) : "",
  });

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    avatar_url: user?.avatar_url || "",
    avatar_key: user?.avatar_key ? String(user.avatar_key) : "",
  });

  useEffect(() => {
    setFormData({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      avatar_url: user?.avatar_url || "",
      avatar_key: user?.avatar_key ? String(user.avatar_key) : "",
    });
    setUploadedTempImageKeys([]);
  }, [user?.full_name, user?.phone_number, user?.avatar_url, user?.avatar_key]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let uploadedInSubmitKey: string | undefined;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      let finalAvatarUrl = formData.avatar_url;
      let finalAvatarKey = formData.avatar_key;

      if (avatarFile) {
        const uploadRes = await handleUploadAvatar();
        finalAvatarUrl = uploadRes?.url || formData.avatar_url;
        finalAvatarKey = uploadRes?.key || formData.avatar_key;
        uploadedInSubmitKey = uploadRes?.key;
      }

      const payload = {
        full_name: formData.full_name.trim() || undefined,
        phone_number: formData.phone_number.trim() || undefined,
        avatar_url: finalAvatarUrl.trim() || undefined,
        avatar_key: finalAvatarKey.trim() || undefined,
      };

      await updateProfile(payload);
      await cleanupTempUploadedImages(String(finalAvatarKey || ""));

      const nextFormData = {
        full_name: payload.full_name || "",
        phone_number: payload.phone_number || "",
        avatar_url: payload.avatar_url || "",
        avatar_key: payload.avatar_key || "",
      };

      setFormData(nextFormData);
      initialImageRef.current = {
        image_url: nextFormData.avatar_url,
        image_key: nextFormData.avatar_key,
      };

      if (user) {
        setUser({
          ...user,
          full_name: nextFormData.full_name,
          phone_number: nextFormData.phone_number,
          avatar_url: nextFormData.avatar_url,
          avatar_key: nextFormData.avatar_key,
        });
      }

      setSuccess("Cập nhật hồ sơ thành công.");
      closeAvatarModal();
    } catch (err) {
      setError(getErrorMessage(err, "Cập nhật hồ sơ thất bại."));

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

  const handleClose = async () => {
    await cleanupTempUploadedImages(initialImageRef.current.image_key);
    setFormData({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      avatar_url: user?.avatar_url || "",
      avatar_key: user?.avatar_key ? String(user.avatar_key) : "",
    });
    setError("");
    setSuccess("");
    closeAvatarModal();
  };

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
    onUploadSuccess: async (uploadRes: UploadFileResult) => {
      const uploadedKey = uploadRes.key?.trim();
      setFormData((prev) => ({
        ...prev,
        avatar_url: uploadRes.url,
        avatar_key: uploadRes.key,
      }));
      if (uploadedKey && uploadedKey !== initialImageRef.current.image_key) {
        setUploadedTempImageKeys((prev) =>
          prev.includes(uploadedKey) ? prev : [...prev, uploadedKey],
        );
      }
    },
  });

  return (
    <ProfileLayout title="Cài đặt tài khoản">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold text-[#0f172a]">
          Thông tin cá nhân
        </h2>

        <div className="mb-8 flex items-center gap-6 border-b border-[#e2e8f0] pb-8">
          <div className="relative">
            <img
              src={
                formData.avatar_url ||
                user?.avatar_url ||
                "https://via.placeholder.com/150"
              }
              className="h-24 w-24 rounded-full border-4 border-[#fff7ed] object-cover"
              alt="Avatar"
            />
            <button
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white hover:bg-[#334155]"
              type="button"
              onClick={openAvatarModal}>
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-[#0f172a]">
              {formData.full_name || user?.full_name || "Người dùng Bookora"}
            </p>
            <p className="text-[#64748b]">Chấp nhận JPG, PNG. Tối đa 2MB.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-[#0f172a]">Họ và tên</label>
            <input
              type="text"
              name="full_name"
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d]"
              placeholder="Nguyễn Văn A"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-2 block text-[#0f172a]">
              Email (Không thể thay đổi)
            </label>
            <input
              type="email"
              disabled
              className="w-full rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] px-4 py-3 text-[#64748b]"
              value={user?.email || "user@example.com"}
            />
            <p className="mt-2 text-sm text-[#64748b]">Email đã được xác thực</p>
          </div>
          <div>
            <label className="mb-2 block text-[#0f172a]">Số điện thoại</label>
            <input
              type="text"
              name="phone_number"
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d]"
              placeholder="0901234567"
              value={formData.phone_number}
              onChange={handleChange}
            />
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
          <div className="flex flex-wrap gap-4 border-t border-[#e2e8f0] pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border-2 border-[#e2e8f0] px-6 py-3 font-medium text-[#0f172a] transition-colors hover:bg-[#fff7ed]">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingAvatar}
              className="flex w-fit items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-white transition-colors hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-5 w-5" />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-[#0f172a]">
              Cập nhật ảnh đại diện
            </h3>

            <label
              className="block cursor-pointer rounded-xl border-2 border-dashed border-[#e2e8f0] p-6 text-center transition hover:border-[#fcd34d]"
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
              <p className="text-sm text-[#64748b]">
                Kéo và thả ảnh vào đây hoặc bấm để chọn ảnh
              </p>
              <p className="mt-1 text-xs text-[#64748b]">
                JPG, PNG - tối đa 2MB
              </p>
            </label>

            {avatarPreview && (
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-16 w-16 rounded-full border object-cover"
                />
                <p className="truncate text-sm text-[#64748b]">
                  {avatarFile?.name}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-full border border-[#e2e8f0] px-4 py-2 text-[#64748b] hover:bg-[#fff7ed]"
                onClick={closeAvatarModal}
                disabled={isUploadingAvatar}>
                Hủy
              </button>
              <button
                type="button"
                className="rounded-full bg-[#0f172a] px-4 py-2 text-white hover:bg-[#334155] disabled:opacity-60"
                onClick={handleUploadAvatar}
                disabled={!avatarFile || isUploadingAvatar}>
                {isUploadingAvatar ? "Đang upload..." : "Lưu ảnh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
};

export default ProfilePage;
