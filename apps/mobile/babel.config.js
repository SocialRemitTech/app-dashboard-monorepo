module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    // Reanimated 4 extracted worklets into react-native-worklets — the plugin lives there now,
    // and it must be LAST. (In Reanimated 3 this was 'react-native-reanimated/plugin'.)
    plugins: ['react-native-worklets/plugin'],
  };
};
