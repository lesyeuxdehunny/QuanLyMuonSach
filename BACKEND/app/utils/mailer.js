const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

exports.sendResetPasswordEmail = async (toEmail, resetLink) => {
  // Nếu chưa cấu hình SMTP thật, in link ra console để test ở môi trường dev
  if (!config.mail.user || !config.mail.pass) {
    console.log(`[DEV] Link đặt lại mật khẩu cho ${toEmail}: ${resetLink}`);
    return;
  }

  await transporter.sendMail({
    from: `"Thư viện Trạm Dừng Chân" <${config.mail.user}>`,
    to: toEmail,
    subject: "Yêu cầu đặt lại mật khẩu",
    html: `
      <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản thư viện.</p>
      <p>Nhấn vào liên kết bên dưới để đặt mật khẩu mới (liên kết có hiệu lực trong 15 phút):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
  });
};