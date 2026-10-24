import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Mail,
  ArrowLeft,
  RotateCw,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { otpRequest } from "../api/auth";

/**
 * =========================================================================
 * PHẦN API BẠN TỰ VIẾT / TÍCH HỢP TẠI ĐÂY
 * =========================================================================
 * Bạn có thể import client API từ '../api/client' hoặc '../api/auth'
 * và thay thế phần mock bên dưới bằng API thực tế của dự án.
 */

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email của bạn!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await otpRequest(email);
      sessionStorage.setItem("reset_email", email.trim());
      navigate({
        to: "/verify-otp",
      });
      // Hoặc lưu vào sessionStorage/url
      sessionStorage.setItem("reset_email", email);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      setError(
        errorMsg || "Không thể gửi mã OTP. Vui lòng kiểm tra lại email!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Quên mật khẩu?
          </h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Nhập email tài khoản của bạn để nhận mã xác thực OTP gồm 6 chữ số
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg mt-2 flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-200"
            }`}>
            {isLoading ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>Đang gửi mã...</span>
              </>
            ) : (
              <span>Gửi mã xác thực OTP</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang Đăng nhập</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
