import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import tseslint from "typescript-eslint";
import pkg from "eslint/config";
const { globalIgnores } = pkg;

// Layering: lib/firebase.ts -> features/*/services -> features/*/hooks -> UI.
// Only lib/firebase.ts and services talk to Firebase. Type-only imports
// (for example `import type { Timestamp }`) are allowed everywhere.
const firebasePatterns = [
  {
    regex: "^firebase(/|$)",
    allowTypeImports: true,
    message:
      "Only src/lib/firebase.ts and features/<feature>/services talk to Firebase. Add a function to a service.",
  },
  {
    regex: "(^|/)lib/firebase$",
    allowTypeImports: true,
    message:
      "Only features/<feature>/services use the Firebase instances. Add a function to a service.",
  },
];

// UI reaches data only through features/*/hooks.
const servicePattern = {
  regex: "(^|/)services(/|$)",
  allowTypeImports: true,
  message:
    "UI doesn't call services. Use a hook from features/<feature>/hooks.",
};

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      reactYouMightNotNeedAnEffect.configs["recommended"],
    ],
    plugins: {
      react,
      "react-you-might-not-need-an-effect": reactYouMightNotNeedAnEffect,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React best practices
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/prop-types": "off", // Using TypeScript instead

      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "react/no-danger": "error",
      "react/jsx-no-script-url": "error",
      "react/jsx-no-target-blank": "error",

      // Layering (see firebasePatterns above). "warn" until the existing
      // imports are moved behind services and hooks; then switch to "error".
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        { patterns: firebasePatterns },
      ],

      // TypeScript best practices
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // General best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
    },
  },
  {
    // The layers allowed to talk to Firebase
    files: [
      "src/lib/firebase.ts",
      "src/features/*/services/**",
      "src/utils/mapFirebaseError.ts", // needs FirebaseError for instanceof
    ],
    rules: { "@typescript-eslint/no-restricted-imports": "off" },
  },
  {
    // UI: components, pages and feature components use hooks only
    files: [
      "src/components/**",
      "src/pages/**",
      "src/features/*/components/**",
    ],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        { patterns: [...firebasePatterns, servicePattern] },
      ],
    },
  },
]);
