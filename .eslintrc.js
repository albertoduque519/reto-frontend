module.exports = {
  "extends": ["plugin:vue/recommended"],
  "plugins": ["vue"],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
}