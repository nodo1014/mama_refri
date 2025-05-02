// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 네트워크 연결 문제 해결을 위한 설정
config.server = {
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // 모든 IP에서의 연결 허용
      res.setHeader("Access-Control-Allow-Origin", "*");
      return middleware(req, res, next);
    };
  },
};

// 캐시 최적화
config.cacheStores = [];

module.exports = config;
