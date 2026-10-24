import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  ArrowLeft,
  RotateCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { otpRequest, otpVerify } from "../api/auth";

/**
 * =========================================================================
 * PHẦN API BẠN TỰ VIẾT / TÍCH HỢP TẠI ĐÂY
 * =========================================================================
 * Bạn có thể import client API từ '../api/client' hoặc '../api/auth'
 * và thay thế phần mã giả lập (mock) bên dưới bằng API thực tế của dự án.
 */

export const resendOtpApi = async (targetEmail?: string): Promise<void> => {
  // TODO: Thay thế bằng API gửi lại mã OTP của bạn, ví dụ:
  // await publicClient.post("/auth/resend-otp", { email: targetEmail });
  console.log(`[API Mock] Yêu cầu gửi lại mã OTP tới: ${targetEmail || "N/A"}`);
  await new Promise((resolve) => setTimeout(resolve, 400));
};

const OTP_LENGTH = 6;

const VerifyOtpPage = () => {
  const navigate = useNavigate();

  // Đọc email từ URL query nếu có (ví dụ: /verify-otp?email=abc@gmail.com)
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    const emailParam = sessionStorage.getItem("reset_email") || "";
    if (emailParam) {
      setEmail(emailParam);
    }
    if (!emailParam) {
      // Nếu không có email trong sessionStorage, chuyển hướng về trang quên mật khẩu
      navigate({
        to: "/forgot-password",
      });
    }
  }, [navigate]);

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);

  // Mảng tham chiếu đến 6 ô input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tự động focus vào ô đầu tiên khi trang tải
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Đếm ngược thời gian gửi lại mã
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Xử lý gửi mã OTP và tự động chuyển trang khi thành công
  const submitOtp = useCallback(
    async (otpCode: string) => {
      if (isLoading || isSuccess) return;
      setIsLoading(true);
      setError("");

      try {
        const res = await otpVerify(email, otpCode);
        const resetToken = res.data.resetToken; // Giả sử API trả về resetToken khi xác thực thành công
        sessionStorage.setItem("reset_token", resetToken);
        setIsSuccess(true);
        // Lưu mã OTP đã xác thực vào sessionStorage để trang đặt mật khẩu mới sử dụng
        sessionStorage.setItem("verified_otp", otpCode);
        if (email) {
          sessionStorage.setItem("reset_email", email);
        }

        // Tự động chuyển hướng sang trang đặt mật khẩu mới sau hiệu ứng thành công ngắn
        setTimeout(() => {
          navigate({
            to: "/reset-password",
          });
        }, 600);
      } catch (err: unknown) {
        const errorMsg =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : null;
        setError(
          errorMsg ||
            "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại!",
        );
        // Reset lại OTP và focus lại ô đầu tiên
        setOtp(new Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    },
    [email, isLoading, isSuccess, navigate],
  );

  // Xử lý khi người dùng nhập từng ký tự
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const rawVal = e.target.value;
    // Chỉ lấy ký tự số cuối cùng được nhập
    const digit = rawVal.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (error) setError("");

    // Nếu vừa nhập xong một số, tự động chuyển focus sang ô tiếp theo
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Kiểm tra nếu đã nhập đủ cả 6 số -> TỰ ĐỘNG XÁC THỰC VÀ CHUYỂN TRANG
    const fullCode = newOtp.join("");
    if (fullCode.length === OTP_LENGTH && newOtp.every((char) => char !== "")) {
      submitOtp(fullCode);
    }
  };

  // Xử lý các phím điều hướng: Backspace, mũi tên trái / phải
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Nếu ô hiện tại có ký tự -> xoá ô hiện tại
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Nếu ô hiện tại rỗng -> lùi về ô trước đó và xoá ký tự ô trước
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý dán (Paste) mã OTP 6 số
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!digitsOnly) return;

    const newOtp = [...otp];
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOtp[i] = digitsOnly[i] || "";
    }
    setOtp(newOtp);
    if (error) setError("");

    // Focus vào ô tiếp theo hoặc ô cuối cùng
    const nextEmptyIndex = newOtp.findIndex((char) => char === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }

    // Nếu paste đủ 6 số -> Tự động xác thực ngay lập tức
    if (digitsOnly.length === OTP_LENGTH) {
      submitOtp(digitsOnly);
    }
  };

  // Xử lý khi nhấn nút gửi lại mã OTP
  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      await otpRequest(email);
      setCountdown(60);
      setOtp(new Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau!");
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-lg border border-gray-100 text-center relative overflow-hidden">
        {/* Thanh trang trí gradient phía trên */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

        {/* Biểu tượng bảo mật */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
          {isSuccess ? (
            <CheckCircle2 className="h-8 w-8 text-green-600 animate-bounce" />
          ) : (
            <ShieldCheck className="h-8 w-8" />
          )}
        </div>

        {/* Tiêu đề & mô tả */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Xác thực mã OTP
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed">
          Vui lòng nhập mã OTP gồm{" "}
          <span className="font-semibold text-gray-700">6 số</span> đã được gửi
          đến{" "}
          {email ? (
            <span className="text-blue-600 font-medium">{email}</span>
          ) : (
            "hộp thư hoặc số điện thoại của bạn"
          )}
        </p>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="mt-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2.5 text-left">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Thông báo thành công */}
        {isSuccess && (
          <div className="mt-5 p-3.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 animate-pulse" />
            <span>
              Xác thực thành công! Đang chuyển trang đặt mật khẩu mới...
            </span>
          </div>
        )}

        {/* Khu vực 6 ô nhập mã OTP */}
        <div className="my-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Mỗi số 1 ô (Tự động chuyển khi đủ 6 số)
          </label>
          <div
            className="flex justify-center items-center gap-2 sm:gap-3.5"
            onPaste={handlePaste}>
            {otp.map((digit, index) => {
              const hasError = Boolean(error);
              return (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  disabled={isLoading || isSuccess}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-extrabold rounded-2xl border transition-all duration-150 outline-none select-none ${
                    hasError
                      ? "border-red-400 bg-red-50/50 text-red-700 focus:ring-4 focus:ring-red-100 focus:border-red-500"
                      : digit
                        ? "border-blue-600 bg-blue-50/30 text-gray-900 shadow-sm"
                        : "border-gray-200 bg-gray-50/60 text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                />
              );
            })}
          </div>
        </div>

        {/* Nút xác nhận thủ công (nếu người dùng muốn bấm lại) */}
        <button
          type="button"
          disabled={!isOtpComplete || isLoading || isSuccess}
          onClick={() => submitOtp(otp.join(""))}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
            !isOtpComplete || isLoading || isSuccess
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-200"
          }`}>
          {isLoading ? (
            <>
              <RotateCw className="w-5 h-5 animate-spin" />
              <span>Đang kiểm tra mã...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Đã xác thực</span>
            </>
          ) : (
            <span>Xác nhận & Đặt lại mật khẩu</span>
          )}
        </button>

        {/* Phần gửi lại mã OTP */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
          <span>Bạn vẫn chưa nhận được mã?</span>
          {countdown > 0 ? (
            <span className="font-semibold text-gray-400">
              Gửi lại sau{" "}
              <span className="text-blue-600 font-bold">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 transition">
              {isResending ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Đang gửi lại...</span>
                </>
              ) : (
                <span>Gửi lại mã OTP</span>
              )}
            </button>
          )}
        </div>

        {/* Quay lại trang đăng nhập */}
        <div className="mt-8 pt-6 border-t border-gray-100">
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

export default VerifyOtpPage;
