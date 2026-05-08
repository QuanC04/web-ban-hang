import React, { useEffect, useMemo, useState } from "react";
import { X, MapPin } from "lucide-react";
import { addNewAddress, getProvinces, updateAddress } from "../api/address";
import type {
  AddAddressModalProps,
  CreateAddressPayload,
  ProvinceOption,
} from "../models";

type VietnamWard = {
  id: string;
  name: string;
};

type VietnamProvinceApiItem = {
  id: string;
  province: string;
  wards: VietnamWard[];
};

const AddAddressModal = ({
  isOpen,
  onClose,
  isEdit,
  addressData,
  onSuccess,
}: AddAddressModalProps) => {
  const [formData, setFormData] = useState<CreateAddressPayload>({
    name: "",
    phone_number: "",
    province_id: "",
    province_name: "",
    district: "",
    street: "",
    isdefault: false,
  });
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isOpen && provinces.length === 0) {
      const loadProvinces = async () => {
        setIsLoading(true);
        try {
          const data = (await getProvinces()) as VietnamProvinceApiItem[];
          const options = data.map((item) => ({
            value: item.id,
            label: item.province,
            raw: item,
          }));
          setProvinces(options);
        } catch (error) {
          console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadProvinces();
    }
  }, [isOpen, provinces.length]);

  const districts = useMemo(() => {
    if (!formData.province_id) return [];
    const selectedProvince = provinces.find(
      (p) => p.value === formData.province_id,
    );
    return selectedProvince
      ? (selectedProvince.raw.wards as VietnamWard[])
      : ([] as VietnamWard[]);
  }, [formData.province_id, provinces]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }
    if (name === "province_id") {
      const selectedProvince = provinces.find((p) => p.value === value);

      setFormData({
        ...formData,
        province_id: value,
        province_name: selectedProvince?.label ?? "",
        district: "",
      });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && addressData) {
        await updateAddress(addressData.id, formData);
      } else {
        await addNewAddress(formData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      return;
    }
  };

  useEffect(() => {
    if (isEdit && addressData) {
      setFormData(addressData);
    } else {
      setFormData({
        name: "",
        phone_number: "",
        province_id: "",
        province_name: "",
        district: "",
        street: "",
        isdefault: false,
      });
    }
  }, [isEdit, addressData, isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Nhấn ra ngoài để đóng */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#0f172a]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fcd34d] text-[#0f172a]">
              <MapPin size={18} />
            </span>
            {isEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-[#fff7ed]">
            <X size={22} className="text-[#64748b]" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-[#e2e8f0] px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#fcd34d]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="09xxx"
                className="w-full rounded-lg border border-[#e2e8f0] px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#fcd34d]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
                Tỉnh / Thành phố
              </label>
              <select
                name="province_id"
                value={formData.province_id}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#fcd34d]">
                <option value="">
                  {isLoading ? "Đang tải..." : "Chọn Tỉnh/TP"}
                </option>
                {provinces.map((province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
                Quận / Huyện
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#fcd34d]">
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district, index) => (
                  <option key={`${district.id}-${index}`} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
              Địa chỉ chi tiết (Số nhà, tên đường)
            </label>
            <textarea
              name="street"
              value={formData.street}
              onChange={handleChange}
              rows={2}
              placeholder="VD: 123 Đường ABC..."
              className="w-full rounded-lg border border-[#e2e8f0] px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#fcd34d]"></textarea>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="default-addr"
              name="isdefault"
              checked={formData.isdefault}
              onChange={handleChange}
              className="h-5 w-5 cursor-pointer rounded border-[#cbd5e1] text-[#fcd34d] focus:ring-[#fcd34d]"
            />
            <label
              htmlFor="default-addr"
              className="cursor-pointer select-none text-sm text-[#64748b]">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[#e2e8f0] py-2.5 font-medium text-[#64748b] transition hover:bg-[#fff7ed]">
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-[#0f172a] py-2.5 font-medium text-white transition hover:bg-[#334155]">
              Lưu địa chỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddAddressModal;
