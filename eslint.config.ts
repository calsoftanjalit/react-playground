import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['node_modules', 'dist', 'build'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      react: pluginReact,
      prettier: eslintPluginPrettier,
    },

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          printWidth: 100,
        },
      ],
    },
  },
];

export default config;
