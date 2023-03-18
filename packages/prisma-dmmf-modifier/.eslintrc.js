/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  root: true,
  extends: ["custom"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
