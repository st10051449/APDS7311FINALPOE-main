// eslint.config.js
module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // You can define `parserOptions` here if needed
      parserOptions: {
        ecmaVersion: 12,
      },
    },
    rules: {
      // Your custom rules here (optional)
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];

