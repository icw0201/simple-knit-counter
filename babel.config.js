module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@screens': './src/screens',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@storage': './src/storage',
          '@navigation': './src/navigation',
          '@styles': './src/styles',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
