import { useEffect, useMemo, useState } from "react";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import AddAddressModal from "../component/addAddressModal";
import ProfileLayout from "../component/profileLayout";
import { deleteAddress, getAddressByUserId } from "../api/address";
import type { AddressItem } from "../models";
import { useUserStore } from "../store/user";

const getAddressLine = (item: AddressItem) =>
  [item.street, item.district, item.province_name].filter(Boolean).join(", ");

const ProfileAddressPage = () => {
  const { user } = useUserStore();
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(
    null,
  );
  const [addressData, setAddressData] = useState<AddressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );

  const sortedAddresses = useMemo(() => {
    return [...addressData].sort((left, right) => {
      if (left.isdefault === right.isdefault) return 0;
      return left.isdefault ? -1 : 1;
    });
  }, [addressData]);

  const fetchAddressData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getAddressByUserId();
      setAddressData(data);
    } catch {
      setErrorMessage("Không thể tải danh sách địa chỉ lúc này.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSaved = async () => {
    await fetchAddressData();
  };

  const handleOpenAdd = () => {
    setSelectedAddress(null);
    setIsEdit(false);
    setIsAddAddressModalOpen(true);
  };

  const handleOpenEdit = (address: AddressItem) => {
    setSelectedAddress(address);
    setIsEdit(true);
    setIsAddAddressModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddAddressModalOpen(false);
    setSelectedAddress(null);
    setIsEdit(false);
  };

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      setAddressData([]);
      return;
    }

    void getAddressByUserId()
      .then((data) => {
        setAddressData(data);
        setErrorMessage("");
      })
      .catch(() => setErrorMessage("Không thể tải danh sách địa chỉ lúc này."))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const handleDeleteAddress = async (address: AddressItem) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa địa chỉ của ${address.name}?`,
    );
    if (!isConfirmed) return;

    try {
      setDeletingAddressId(address.id);
      setErrorMessage("");
      await deleteAddress(address.id);
      setAddressData((prev) => prev.filter((item) => item.id !== address.id));
    } catch {
      setErrorMessage("Xóa địa chỉ thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingAddressId(null);
    }
  };

  return (
    <ProfileLayout title="Cài đặt tài khoản">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#0f172a]">Địa chỉ của tôi</h2>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#0f172a] px-4 py-2 text-white transition-colors hover:bg-[#334155]"
            onClick={handleOpenAdd}>
            <Plus className="h-5 w-5" />
            <span>Thêm địa chỉ mới</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-sm text-[#64748b]">
              Đang tải địa chỉ...
            </div>
          ) : sortedAddresses.length > 0 ? (
            sortedAddresses.map((item) => {
              const isDeleting = deletingAddressId === item.id;
              return (
                <article
                  key={item.id}
                  className={`rounded-xl border-2 p-6 transition-all ${
                    item.isdefault
                      ? "border-[#fcd34d] bg-[#fff7ed]"
                      : "border-[#e2e8f0] hover:border-[#fcd34d]"
                  }`}>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#fcd34d]" />
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[#0f172a]">
                            {item.name}
                          </span>
                          <span className="text-[#64748b]">
                            | {item.phone_number}
                          </span>
                        </div>
                        <p className="mb-3 text-[#475569]">
                          {getAddressLine(item) || "Chưa có thông tin địa chỉ"}
                        </p>
                        {item.isdefault && (
                          <span className="inline-block rounded-full bg-[#fcd34d] px-3 py-1 text-sm font-medium text-[#0f172a]">
                            Địa chỉ mặc định
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#0f172a] transition-colors hover:bg-[#f1f5f9]"
                        title="Cập nhật địa chỉ"
                        onClick={() => handleOpenEdit(item)}>
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(item)}
                        disabled={isDeleting}
                        className="rounded-lg p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-60"
                        title="Xóa địa chỉ">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {!item.isdefault && (
                    <button className="text-sm font-medium text-[#0f172a] hover:text-[#334155]">
                      Đặt làm mặc định
                    </button>
                  )}
                </article>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff7ed]">
                <MapPin className="h-10 w-10 text-[#64748b]" />
              </div>
              <p className="mb-4 text-[#64748b]">Chưa có địa chỉ nào</p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="rounded-full bg-[#0f172a] px-6 py-3 text-white hover:bg-[#334155]">
                Thêm địa chỉ mới
              </button>
            </div>
          )}
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={handleCloseModal}
        isEdit={isEdit}
        addressData={selectedAddress || undefined}
        onSuccess={handleAddressSaved}
      />
    </ProfileLayout>
  );
};

export default ProfileAddressPage;
