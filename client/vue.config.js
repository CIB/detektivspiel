module.exports = {
  devServer: {
    proxy: {
      "/napi/*": {
        target: "ws://localhost:3000",
        ws: true
      }
    }
  }
};
