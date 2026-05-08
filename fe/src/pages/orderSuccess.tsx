import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

const OrderSuccessPage = () => {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-14 pt-8 md:px-8 md:pt-12">
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center md:p-10">
        <CheckCircle2 size={54} className="mx-auto text-emerald-600" />
        <h1 className="mt-4 text-3xl font-black text-emerald-900">
          Đặt hàng thành công
        </h1>
        <p className="mt-2 text-sm text-emerald-800">
          Cảm ơn bạn đã mua hàng. Đơn của bạn đang được shop xử lý và sẽ giao
          sớm nhất.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/cart"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Quay lại giỏ hàng
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccessPage;
