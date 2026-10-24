// be/src/lib/email.ts
import nodemailer from 'nodemailer';
import { SendmailSentMessageInfo } from 'nodemailer';

// Khởi tạo Transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true nếu dùng port 465, false cho 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Kiểm tra kết nối SMTP khi khởi động (tuỳ chọn)
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Lỗi kết nối Email SMTP:', error.message);
    } else {
        console.log('✅ Kết nối Email SMTP thành công!');
    }
});

/**
 * Hàm gửi mã OTP đặt lại mật khẩu
 */
export const sendOtpEmail = async (
    toEmail: string,
    otpCode: string,
): Promise<SendmailSentMessageInfo> => {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Xác thực đặt lại mật khẩu</h2>
        <p>Xin chào,</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản tại cửa hàng của chúng tôi.</p>
        <p>Mã xác thực OTP của bạn là:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e40af; background: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #3b82f6;">
                ${otpCode}
            </span>
        </div>
        <p style="color: #ef4444; font-size: 14px;"><strong>Lưu ý:</strong> Mã này chỉ có hiệu lực trong vòng <strong>5 phút</strong>. Không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">Nếu bạn không yêu cầu hành động này, vui lòng bỏ qua email này.</p>
    </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: toEmail,
        subject: `[Mã xác thực] Đặt lại mật khẩu của bạn: ${otpCode}`,
        text: `Mã xác thực OTP của bạn là: ${otpCode}. Mã này có hiệu lực trong 5 phút.`,
        html: htmlContent,
    };

    return await transporter.sendMail(mailOptions);
};
