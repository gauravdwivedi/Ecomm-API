module.exports = {
  env: {
    "browser": true,
    "amd": true,
    "node": true
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint","import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended","plugin:import/errors","plugin:import/warnings","plugin:import/typescript"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "import/named": "off",
    "import/namespace": "off",
    "@typescript-eslint/no-namespace": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-case-declarations": "off"
  },
};
