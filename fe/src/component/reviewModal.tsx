import React, { useState } from "react";
import { Star, X, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { createReview } from "../api/review";
import { useUserStore } from "../store/user";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productImage?: string;
  productId?: string;
  orderItemId?: string;
  useRealApi?: boolean; // Mặc định false (dùng mock), đổi thành true khi đã mount API ở BE
  onSuccess?: (newReview: {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    variant: string;
    helpful: number;
  }) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Rất tệ",
  2: "Không hài lòng",
  3: "Bình thường",
  4: "Hài lòng",
  5: "Tuyệt vời",
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productName = "Sản phẩm",
  productImage,
  orderItemId = "mock_order_item_001",
  useRealApi = true,
  onSuccess,
}) => {
  const { user } = useUserStore();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStar = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setErrorMessage("Vui lòng chọn số sao đánh giá (1 - 5 sao)");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        order_item_id: orderItemId,
        rating,
        comment: comment.trim() || undefined,
      };

      await createReview(payload);

      setIsSuccess(true);

      // Chờ 1 giây để người dùng thấy thông báo thành công
      setTimeout(() => {
        onSuccess?.({
          id: `review_${Date.now()}`,
          userName: user?.full_name || "Bạn (Đánh giá mới)",
          rating,
          date: "Vừa xong",
          comment: comment.trim() || "Người dùng không để lại bình luận.",
          variant: "Tiêu chuẩn",
          helpful: 0,
        });
        setIsSuccess(false);
        setComment("");
        setRating(5);
        onClose();
      }, 1000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Không thể gửi đánh giá. Vui lòng thử lại sau.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fcd34d] text-[#0f172a]">
              <Star className="h-5 w-5 fill-[#0f172a] text-[#0f172a]" />
            </span>
            <div>
              <h3 className="font-bold text-[#0f172a]">Đánh giá sản phẩm</h3>
              <p className="text-xs text-[#64748b]">
                {useRealApi
                  ? "Kết nối API thật"
                  : "Dữ liệu Mock (Sẵn sàng kết nối API)"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f172a]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
            <h4 className="mt-4 text-xl font-bold text-[#0f172a]">
              Đánh giá thành công!
            </h4>
            <p className="mt-1 text-sm text-[#64748b]">
              Cảm ơn bạn đã đóng góp ý kiến cho sản phẩm này.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Thông tin sản phẩm */}
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3 border border-[#e2e8f0]">
              <img
                src={productImage || "https://via.placeholder.com/60?text=SP"}
                alt={productName}
                className="h-12 w-12 rounded-lg object-cover border border-[#e2e8f0]"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-[#0f172a]">
                  {productName}
                </p>
                <p className="text-xs text-[#64748b]">Chất lượng sản phẩm</p>
              </div>
            </div>

            {/* Chọn số sao */}
            <div className="mb-6 text-center">
              <p className="mb-2 text-sm font-medium text-[#475569]">
                Bạn đánh giá sản phẩm này thế nào?
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentStar;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none">
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          isFilled
                            ? "fill-[#fcd34d] text-[#fcd34d]"
                            : "fill-transparent text-[#cbd5e1]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm font-semibold text-[#0f172a]">
                {RATING_LABELS[currentStar]}
              </p>
            </div>

            {/* Nhập nội dung bình luận */}
            <div className="mb-5">
              <label
                htmlFor="review-comment"
                className="mb-1.5 block text-sm font-semibold text-[#0f172a]">
                Nhận xét chi tiết
              </label>
              <textarea
                id="review-comment"
                rows={4}
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ cảm nhận về chất lượng sản phẩm, đóng gói, thái độ phục vụ để giúp người mua khác nhé..."
                className="w-full rounded-xl border border-[#cbd5e1] p-3 text-sm text-[#0f172a] placeholder-[#94a3b8] transition focus:border-[#0f172a] focus:outline-none"
              />
              <div className="mt-1 flex justify-between text-xs text-[#64748b]">
                <span>Tối thiểu 10 ký tự là tốt nhất</span>
                <span>{comment.length}/500</span>
              </div>
            </div>

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600">
                {errorMessage}
              </div>
            )}

            {/* Note về Mock API */}
            {!useRealApi && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Đang bật chế độ <strong>Mock Data</strong> để bạn trải nghiệm
                  ngay. Khi Backend có API, chỉ cần chuyển{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    useRealApi=true
                  </code>
                  .
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full border border-[#cbd5e1] px-5 py-2.5 text-sm font-medium text-[#475569] transition hover:bg-[#f1f5f9] disabled:opacity-50">
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
