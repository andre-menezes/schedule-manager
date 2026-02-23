module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native$': '<rootDir>/tests/__mocks__/react-native.ts',
    '^expo-secure-store$': '<rootDir>/tests/__mocks__/expo-secure-store.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
