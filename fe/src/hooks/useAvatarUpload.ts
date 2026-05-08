import { useCallback, useEffect, useState } from "react";
import { uploadImage } from "../api/upload";
import type { UseAvatarUploadOptions } from "../models";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];



export const useAvatarUpload = ({
  onUploadSuccess,

}: UseAvatarUploadOptions) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const closeAvatarModal = useCallback(() => {
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview("");
    setIsAvatarModalOpen(false);
  }, [avatarPreview]);

  const openAvatarModal = useCallback(() => {
    setIsAvatarModalOpen(true);
  }, []);

  const handleAvatarFileSelect = useCallback((file?: File) => {
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert("Chỉ chấp nhận file JPG hoặc PNG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File ảnh vượt quá 2MB.");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }, [avatarPreview]);

  const handleUploadAvatar = useCallback(async () => {
    if (!avatarFile) return;

    try {
      setIsUploadingAvatar(true);
      const uploadRes = await uploadImage(avatarFile);
      const avatarUrl = uploadRes.data.url;


      if (!avatarUrl) {
        alert("Upload thành công nhưng không nhận được URL ảnh.");
        return;
      }

      await onUploadSuccess?.(uploadRes.data);

      closeAvatarModal();
      return uploadRes.data;
    } catch (error) {
      console.error(error);
      alert("Không thể upload ảnh, vui lòng thử lại.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }, [avatarFile, closeAvatarModal,onUploadSuccess]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return {
    isAvatarModalOpen,
    openAvatarModal,
    closeAvatarModal,
    avatarFile,
    avatarPreview,
    isUploadingAvatar,
    handleAvatarFileSelect,
    handleUploadAvatar,
  };
};
