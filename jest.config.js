module.exports = {
  // Presets and environment configuration
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src',

  // A list of paths to directories that Jest should use to search for files in
  moduleDirectories: ['node_modules', 'src'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/*.module.ts',
    '!**/main.ts', // Exclude NestJS bootstrap file
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: '../coverage',

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['text', 'lcov', 'cobertura'],

  // A list of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/'],

  // The regexp pattern Jest uses to detect test files
  testRegex: '.*\\.spec\\.ts$',

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
};
