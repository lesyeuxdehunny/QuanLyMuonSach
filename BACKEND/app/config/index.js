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
  },
};

module.exports = config;