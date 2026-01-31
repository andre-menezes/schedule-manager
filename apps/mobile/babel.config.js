module.exports = function (api) {
  api.cache(true);

  // Check if running in test environment
  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
      ],
    };
  }

  return {
    presets: ['babel-preset-expo'],
  };
};
