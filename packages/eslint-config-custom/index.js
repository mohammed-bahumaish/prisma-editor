module.exports = {
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  ],
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "next",
    "plugin:@next/next/recommended",
    "turbo",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-misused-promises": [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  parserOptions: {
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
};
