const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      include: path.resolve(__dirname, "locales"),
      type: "javascript/auto",
    });
    return config;
  },
}
