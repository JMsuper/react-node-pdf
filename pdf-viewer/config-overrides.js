const path = require("path");

module.exports = {
  webpack: function (config, env) {
    config = {
      ...config,
      devtool: process.env.NODE_ENV === "development" ? "eval-source-map" : "source-map",
      module: {
        ...config.module,
        rules: [
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
          },
          ...config.module.rules,
        ],
      },
      resolve: {
        ...config.resolve,
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
          "pdfjs-dist": path.resolve("./node_modules/pdfjs-dist/legacy/build/pdf.js"),
        },
      },
    };
    return config;
  },
};