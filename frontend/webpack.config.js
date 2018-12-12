const path = require('path');

module.exports = {
  resolve: {
    alias: {
      "~app": path.resolve('src/app/'),
      "~assets": path.resolve('src/assets/'),
      "~env": path.resolve('config/environment'),
      "~pages": path.resolve('src/app/pages/'),
      "~services": path.resolve('src/app/services/'),
      "~store": path.resolve('src/app/store/'),
    },
    extensions: ['.ts', '.js'],
  },
  node: {
    crypto: true,
    http: true,
    https: true,
    os: true,
    vm: true,
    stream: true,
  },
};
