const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// mp3가 assetExts에 있는지 확인 후 확장
defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'mp3',
];

const config = {
  transformer: {
    unstable_allowRequireContext: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);