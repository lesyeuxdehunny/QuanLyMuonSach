require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT || 2511,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/library",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "thay_doi_chuoi_bi_mat_nay_khi_deploy",
    expiresIn: "8h",
    resetExpiresIn: "15m", // hạn của token reset mật khẩu
  },
  mail: {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 587,
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
  },
  client: {
    // URL frontend để build link đặt lại mật khẩu
    url: process.env.CLIENT_URL || "http://localhost:2512",
  },
};

module.exports = config;