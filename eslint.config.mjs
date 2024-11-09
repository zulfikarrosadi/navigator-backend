import unusedImports from "eslint-plugin-unused-imports";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/dist",
      "esm/*",
      "public/*",
      "tests/*",
      "scripts/*",
      "**/*.test.ts",
      "**/*.config.js",
      "**/node_modules",
      "**/coverage",
      "**/build",
    ],
  },
  ...compat.extends("eslint:recommended", "plugin:prettier/recommended"),
  {
    plugins: {
      "unused-imports": unusedImports,
      "@typescript-eslint": typescriptEslint,
      prettier: prettier,
    },
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        project: "tsconfig.json",
      },
    },
    rules: {
      "no-console": "error",
      "prettier/prettier": "warn",
      "no-unused-vars": "error",
      "unused-imports/no-unused-vars": "error",
      "unused-imports/no-unused-imports": "error",
      "object-curly-spacing": ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_.*?$",
        },
      ],
    },
  },
];
