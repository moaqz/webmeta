import moaqz from "eslint-config-moaqz";

export default [
  ...moaqz,
  {
    rules: {
      "comma-dangle": ["error", "always-multiline"],
    },
  },
];
