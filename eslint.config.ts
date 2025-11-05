import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: ["node_modules", "dist", "build"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      js,
      react: pluginReact,
    },
    extends: [
      "eslint:recommended",           
      "plugin:react/recommended",     
      "plugin:@typescript-eslint/recommended", 
      "prettier",                     
    ],
    settings: {
      react: {
        version: "detect", 
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", 
      "no-unused-vars": "warn",
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "es5",
          printWidth: 100,
        },
      ],
    },
  },

  ...tseslint.configs.recommended,
  prettier,
]);
