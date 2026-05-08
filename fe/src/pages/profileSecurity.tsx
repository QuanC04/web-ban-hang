import { Lock, Save, Shield, Smartphone } from "lucide-react";
import { useState } from "react";
import ProfileLayout from "../component/profileLayout";

const ProfileSecurityPage = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <ProfileLayout title="Cài đặt tài khoản">
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d]">
              <Lock className="h-5 w-5 text-[#0f172a]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a]">Đổi mật khẩu</h2>
          </div>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-[#0f172a]">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                title="currentPassword"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d]"
              />
            </div>
            <div>
              <label className="mb-2 block text-[#0f172a]">Mật khẩu mới</label>
              <input
                type="password"
                title="newPassword"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d]"
              />
              <p className="mt-2 text-sm text-[#64748b]">
                Mật khẩu phải có ít nhất 8 ký tự
              </p>
            </div>
            <div>
              <label className="mb-2 block text-[#0f172a]">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                title="confirmPassword"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d]"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-white transition-colors hover:bg-[#334155]">
                <Save className="h-5 w-5" />
                <span>Lưu mật khẩu mới</span>
              </button>
              <button
                type="button"
                className="rounded-full border-2 border-[#e2e8f0] px-6 py-3 transition-colors hover:bg-[#fff7ed]">
                Hủy
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d]">
              <Smartphone className="h-5 w-5 text-[#0f172a]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a]">
              Xác thực hai yếu tố (2FA)
            </h2>
          </div>
          <p className="mb-6 text-[#64748b]">
            Tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác
            thực khi đăng nhập
          </p>
          <div className="flex items-center justify-between rounded-xl bg-[#fff7ed] p-4">
            <div>
              <p className="mb-1 font-medium text-[#0f172a]">
                Xác thực hai yếu tố
              </p>
              <p className="text-sm text-[#64748b]">
                {twoFactorEnabled ? "Đã bật" : "Chưa bật"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                twoFactorEnabled ? "bg-[#fcd34d]" : "bg-[#cbd5e1]"
              }`}>
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="mt-6 rounded-xl border border-[#e2e8f0] p-4">
              <p className="mb-4 text-sm text-[#64748b]">
                Quét mã QR dưới đây bằng ứng dụng xác thực.
              </p>
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl bg-[#fff7ed]">
                <p className="text-[#64748b]">QR Code placeholder</p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd34d]">
              <Shield className="h-5 w-5 text-[#0f172a]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a]">
              Phiên đăng nhập
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-4">
              <div>
                <p className="mb-1 font-medium text-[#0f172a]">
                  Chrome trên Windows
                </p>
                <p className="text-sm text-[#64748b]">
                  TP. Hồ Chí Minh • Đang hoạt động
                </p>
              </div>
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-sm font-medium text-[#0f172a]">
                Thiết bị này
              </span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-full border-2 border-[#e2e8f0] py-3 font-medium text-[#0f172a] transition-colors hover:bg-[#fff7ed]">
            Đăng xuất tất cả thiết bị khác
          </button>
        </section>
      </div>
    </ProfileLayout>
  );
};

export default ProfileSecurityPage;
