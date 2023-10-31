module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/newline-after-import': 'off',
    'import/no-named-as-default-member': 'off',
    'import/first': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'object-curly-spacing': ['error', 'always'],
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     endOfLine: 'auto',
    //     singleQuote: true,
    //     trailingComma: 'all',
    //     bracketSpacing: true,
    //     endOfLine: 'auto',
    //   },
    // ],
    'prettier/prettier': 'error',
  },
};
