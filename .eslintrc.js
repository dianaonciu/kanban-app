// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['next', 'next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y', 'import'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // Using TypeScript instead
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
